const router = require('express').Router();
const { User, Blogpost, Comment } = require('../../models');
const withAuth = require('../../utils/auth'); 


router.post('/', withAuth, async (req, res) => {



  const loggedUserData = await User.findByPk(req.session.user_id);
  const loggedUser = loggedUserData.get({plain: true});

  console.log(loggedUser)

  console.log(req.body)

  try {
    const newComment = await Comment.create({
      
      description: req.body.comment ,
      name: loggedUser.name,
      blogpost_id: req.body.blogpostID,
      user_id: req.session.user_id,
      
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});



router.put('/:id', withAuth, async (req, res) => {

  
  console.log(req.body)
 

  try {
  Blogpost.update(req.body, {
    where: {
      id: req.params.id,
    },
  });

    res.status(200);
  } catch (err) {
    res.status(400).json(err);
  }
});





module.exports = router;
