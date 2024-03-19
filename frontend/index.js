async function getAttendanceData() {
  const emailElement = document.getElementById("email");
  console.log(emailElement.value);
  const response = await fetch(
    `https://us-central1-lunar-analyzer-415415.cloudfunctions.net/function-hello-world?name=${emailElement.nodeValue}`,
  );
  const data = await response.json();
  console.log(data);
}
