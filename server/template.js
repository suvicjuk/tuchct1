import serialize from 'serialize-javascript';

export default function template(body,data) {
  return `<!DOCTYPE HTML>
<html>

<head>
  <meta charset="utf-8">
  <title>Pro MERN Stack</title>
  <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" >
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <script src="https://apis.google.com/js/api:client.js"></script>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
 
  <style>
    table.table-hover tr {cursor: pointer;}
    .panel-title a {display: block; width: 100%; cursor: pointer;}
  </style>

</head>

<body>

<div id="g_id_onload"
data-client_id="403367458642-0ps8els670vtbscl35t9nr8283j9nrt2.apps.googleusercontent.com"
data-login_uri='http://localhost:2000'
data-auto_prompt="false">
</div>

<div class="g_id_signin"
data-type="standard"
data-size="large"
data-theme="outline"
data-text="sign_in_with"
data-shape="rectangular"
data-logo_alignment="left">
</div>

  <!-- Page generated from template. -->
<div id="contents">${body}</div>
<script>window.__INITIAL_DATA__ = ${serialize(data)}</script>

<script src="/env.js"></script>
<script src="/vendor.bundle.js"></script>
<script src="/app.bundle.js"></script>

</body>

</html>
`;
}
