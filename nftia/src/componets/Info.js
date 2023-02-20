

const Info = () => {

    return (

    <div className="bg-dark text-secondary px-4 py-5 text-center">
        <h1 className="display-5 fw-bold text-white">A.I. Art + Blockchain = NFT</h1>
        <br/>
        <div className="clearfix">
          <img src="/images/robotpainting.jpg" className="col-md-4 float-md-end mb-3 ms-md-3" alt="..."/>

          <p className="fs-5 mb-4">
            Art created with artificial intelligence and minted on the blockchain combines the latest in technology with the timeless art of creation.
          </p>

          <p className="fs-5 mb-4">
            Using a computer program to generate unique and original works of art, and adding them to the blockchain for secure verification and protection, allows for a new level of authenticity and value in the digital art world. 
          </p>

          <p className="fs-5 mb-4">
            Whether you're an artist looking to showcase your work or a collector searching for one-of-a-kind pieces, don't miss out on this exciting new way to create and collect art.
          </p>
        </div>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <button type="button" className="btn btn-outline-info btn-lg px-4 me-sm-3 fw-bold" data-bs-toggle="modal" data-bs-target="#hitModal">Read More</button>
          <button type="button" className="btn btn-outline-info btn-lg px-4 me-md-2 fw-bold" data-bs-toggle="modal" data-bs-target="#modalSignup">Join</button>
        </div>
      </div>

    );
};

export default Info;