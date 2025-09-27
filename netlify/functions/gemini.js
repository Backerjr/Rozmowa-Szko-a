<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ask Wiktoria</title>

  <!-- Favicon links -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="icon" href="/favicon.ico" />

  <style>
    body {
      font-family: sans-serif;
      padding: 2rem;
      min-height: 100vh;
      margin: 0;

      /* 🌌 Galaxy + Moon background */
      background: url("galaxy-moon.jpg") no-repeat center center fixed;
      background-size: cover;
      color: white;

      /* Center content */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;

      /* Slight shadow for readability */
      text-shadow: 0 2px 8px rgba(0,0,0,0.8);
    }

    input, button {
      padding: 0.5rem;
      margin: 0.5rem;
      border-radius: 6px;
      border: none;
    }

    input {
      width: 300px;
    }

    button {
      background: #ffffff;
      color: #222;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover {
      background: #ddd;
    }

    pre {
      margin-top: 1rem;
      white-space: pre-wrap;
      background: rgba(0, 0, 0, 0.5);
      padding: 1rem;
      border-radius: 8px;
      max-width: 600px;
    }
  </style>
</head>
<body>
  <h1>🌙 Ask Wiktoria 🌌</h1>
  <input id="prompt" placeholder="Type your question..." />
  <button id="ask">Ask</button>
  <pre id="result"></pre>

  <script src="script.js"></script>
</body>
</html>
