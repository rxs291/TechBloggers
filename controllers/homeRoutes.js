const router = require("express").Router();
const { Blogpost, User } = require("../models");
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
      ],
    });

    const blogpost = blogpostData.get({ plain: true });
    console.log(blogpost)
    console.log(req.session)

    res.render("blogpost", {
      ...blogpost,
      loggedUser: req.session.name,
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
