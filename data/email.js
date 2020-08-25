exports.signupEmail = (toEmail) => {
  return {
    from: 'scooby.dooby.doo.0407@gmail.com',
    to: toEmail,
    subject: 'Successful signup to Online Shop',
    html: '<h4>Congratulations you have successfully signed up to online shop!</h4>',
  };
};

exports.resetPasswordEmail = (toEmail, token) => {
  return {
    from: 'scooby.dooby.doo.0407@gmail.com',
    to: toEmail,
    subject: 'Password reset',
    html: `
      <h3>Password Reset</h3>
      <p>
        Please click this <a href="https://ecommercetintin.herokuapp.com/reset-password/${token}">link</a> to reset your password.
      </p>
    `,
  }
}

exports.resetSuccessEmail = (toEmail) => {
  return {
    from: 'scooby.dooby.doo.0407@gmail.com',
    to: toEmail,
    subject: 'Password reset success',
    html: '<h4>Congratulations you have successfully reset your password!</h4>',
  };
};