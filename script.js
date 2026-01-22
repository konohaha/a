// ★ ここを自分のTeachable MachineのURLに変更
const URL = "https://teachablemachine.withgoogle.com/models/MmEzpjJM4/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // カメラ設定
  webcam = new tmImage.Webcam(300, 300, true); // width, height, flip
  await webcam.setup(); // カメラ許可
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);

  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  for (let i = 0; i < maxPredictions; i++) {
    const text =
      prediction[i].className + " : " +
      (prediction[i].probability * 100).toFixed(1) + "%";
    labelContainer.childNodes[i].innerHTML = text;
  }
}

init();
