// IMPORTANT: Replace this later with your Teachable Machine model link
const MODEL_BASE_URL = "https://teachablemachine.withgoogle.com/models/EPLR2PqXM/"; 
// Example format:
// const MODEL_BASE_URL = "https://teachablemachine.withgoogle.com/models/XXXXXX/";

let model;

async function loadModelOnce() {
  if (model) return;
  const modelURL = MODEL_BASE_URL + "model.json";
  const metadataURL = MODEL_BASE_URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
}

async function classify(imgEl) {
  await loadModelOnce();
  const predictions = await model.predict(imgEl);
  predictions.sort((a, b) => b.probability - a.probability);
  const top = predictions[0];
  return { label: top.className, confidence: Math.round(top.probability * 100) };
}

const input = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");

input.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  preview.src = url;

  preview.onload = async () => {
    result.textContent = "Analyzing photo…";

    try {
      const { label, confidence } = await classify(preview);

      if (confidence < 60) {
        result.textContent =
          `Not sure (${confidence}%). Try a clearer photo with good lighting and the item centered.`;
        return;
      }

      result.innerHTML = `✅ Bin: <b>${label}</b> — Confidence: <b>${confidence}%</b>`;
    } catch (err) {
      console.error(err);
      result.textContent = "Error analyzing image. (Model link missing or incorrect.)";
    }
  };
});
