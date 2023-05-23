const router = require("express").Router();
const { Blogpost, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    if (req.session.logged_in) {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ["password"] },
        include: [{ model: Blogpost }],
      });

      const user = userData.get({ plain: true });

      const blogpostData = await Blogpost.findAll({
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });

      const blogposts = blogpostData.map((blogpost) =>
        blogpost.get({ plain: true })
      );

      res.render("homepage", {
        ...user,
        blogposts,
        logged_in: req.session.logged_in,
      });
    } else {

      const blogpostData = await Blogpost.findAll({
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });

      const blogposts = blogpostData.map((blogpost) =>
        blogpost.get({ plain: true })
      );
      res.render("homepage", {
        blogposts,
        logged_in: req.session.logged_in,
      });
    }
 

    // Pass serialized data and session flag into template
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/blogpost/:id", withAuth, async (req, res) => {
  try {
    const blogpostData = await Blogpost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          attributes: ["description", "date_created", "user_id","name"]
        },
      ],
    });

    const loggedUserData = await User.findByPk(req.session.user_id);
    const loggedUser = loggedUserData.get({plain: true});

    
     

    const blogpost = blogpostData.get({ plain: true }); 

    console.log(blogpost.user_id) 
    console.log(loggedUser.id)

    //this allows for the owner of the blog to update their own post IF the logged user ID equals the BLOGPOST USER ID
    let myblog = loggedUser.id == blogpost.user_id; 

    res.render("blogpost", {
      ...blogpost,
      loggedUser: loggedUser.name,
      myBlog: myblog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Blogpost }],
    });

    const user = userData.get({ plain: true });

    res.render("dashboard", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

module.exports = router;
