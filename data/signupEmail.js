module.exports = (toEmail) => {
  return {
    from: 'scooby.dooby.doo.0407@gmail.com',
    to: toEmail,
    subject: 'Successful signup to Online Shop',
    html: '<h4>Congratulations you have successfully signed up to online shop!</h4>',
  };
};
