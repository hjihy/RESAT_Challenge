function login() {
    // 임의로 지정된 ID와 PW
    const validID = "log123";
    const validPassword = "in123";
  
    // 사용자가 입력한 ID와 PW
    const inputID = document.getElementById("id").value;
    const inputPassword = document.getElementById("password").value;
  
    // 인증 체크
    if (inputID === validID && inputPassword === validPassword) {
      // 로그인 성공
      showToast("로그인이 되었습니다");
    } else {
      // 로그인 실패
      showError("ID 혹은 PW가 잘못되었습니다");
    }
  }
  
  function showToast(message) {
    alert(message);
  }
  
  function showError(message) {
    alert(message);
  }
  