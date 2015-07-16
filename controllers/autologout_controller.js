exports.check = function (req, res, next) {
  if (req.session.user) {
    if (res.locals.session.last_a) {
      console.log("Last action >>> " + res.locals.session.last_a);
      console.log("New action >>> " + res.locals.session.new_a);
      var autoLogout = ((res.locals.session.new_a - res.locals.session.last_a ) / 1000) / 60;
      console.log(autoLogout);
      if (autoLogout >= 2.0) {
        console.log("Auto LogOut");
        res.locals.session.last_a = 0;
        delete req.session.user;
      }
    } else { res.locals.session.last_a = new Date().getTime();
     console.log("Last action >>> " + res.locals.session.last_a); }
    next();
  }
};

//>>> Todo en una sola funcion <<<
