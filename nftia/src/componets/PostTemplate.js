import React from 'react';


const PostTemplate = ({ imageUrl }) => {

  // Facebook post function
  const postToFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${imageUrl}`;
    window.open(shareUrl, "_blank");
  };

  // Twitter post function
  const postToTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${imageUrl}`;
    window.open(tweetUrl, "_blank");
  };

  // Instagram post function
  const postToInstagram = () => {
    // Instagram does not provide a public API for posting images, so you will need to handle this in a different way
    console.log("Not yet. Will Soon.");
  };

  // LinkedIn post function
  const postToLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${imageUrl}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div>

      {/* Facebook button */}
      <button type="button" className="btn bg-transparent p-0 border-0 m-2 fs-3" onClick={postToFacebook}>
        <i className="bi bi-facebook text-white"></i>
      </button>

      {/* Twitter button */}
      <button type="button" className="btn bg-transparent p-0 border-0 m-2 fs-3" onClick={postToTwitter}>
        <i className="bi bi-twitter text-white"></i>
      </button>

      {/* Instagram button */}
      <button type="button" className="btn bg-transparent p-0 border-0 m-2 fs-3" onClick={postToInstagram}>
        <i className="bi bi-instagram text-white"></i>
      </button>

      {/* LinkedIn button */}
      <button type="button" className="btn bg-transparent p-0 border-0 m-2 fs-3" onClick={postToLinkedIn}>
        <i className="bi bi-linkedin text-white"></i>
      </button>
    </div>
  );
};

export default PostTemplate;
