function showCustomAlert(message) {
    const customAlert = document.createElement("div");
    customAlert.style = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        text-align: center;
    `;
    customAlert.innerHTML = `
        <h3>Temple Cals</h3>
        <p>${message}</p>
        <button onclick="document.body.removeChild(this.parentNode)">OK</button>
    `;
    document.body.appendChild(customAlert);
}
