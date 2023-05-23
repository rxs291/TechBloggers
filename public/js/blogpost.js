const commentHandler = async (event) => {
  event.preventDefault();



  const comment = document.querySelector('#comment-desc').value.trim();
  const blogpostID = document.getElementById("blogpost-id").innerHTML;
 


  if (comment) {
    const response = await fetch('/api/blogpost', {
      method: 'POST',
      body: JSON.stringify({ comment, blogpostID }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace(`/blogpost/${blogpostID}`);
    } else {
      alert(response.statusText);
    }
  }

};

const updateHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#blogpost-name').value.trim(); 
  const description = document.querySelector('#blogpost-desc').value.trim();
  const blogpostID = document.getElementById("blogpost-id").innerHTML;

  console.log(name)
  console.log(description)
  console.log(blogpostID)

  if (name && description) {
    const response = await fetch(`/api/blogpost/${blogpostID}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(`/blogpost/${blogpostID}
      `); 
    } else {
      alert('Failed to update');
    }
  }

};


document
  .querySelector('.comment-form')
  .addEventListener('submit', commentHandler);

  document
  .querySelector('.update-blogpost-form')
  .addEventListener('submit', updateHandler);