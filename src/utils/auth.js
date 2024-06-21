export async function handleOAuth2Login() {
  const url
    = 'http://oidcs.cated.local:20005/oauth2/authorize?client_id=vueClient&redirect_uri=http://localhost:3200/login/oauth2/callback/vueClient&grant_type=authorize_code&response_type=code&scope=openid%20profile%20email&state=1234567890'
  // open oauth2 login url
  // var authWin = window.open(
  //   url,
  //   '_blank',
  //   'width=600,height=400,menubar=no,toolbar=no,location=no'
  // )
  location.href = url
}
