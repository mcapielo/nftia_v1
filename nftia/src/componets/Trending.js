import './Trending.css';

const Trending = () => {

    return (

    <div className="container">
        <hr></hr>
        <br/>
        <h1>Trending</h1>
        <br/>
        <br/>
        <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="https://nftia.infura-ipfs.io/ipfs/QmQ4xNWKnFJ7tfJmtNwjXtacRqHFzmoe5Lk9oXTApEjHgk" alt="FirstArtCreation" className="imgTrending"/>
                    <div className="container">
                        <div className="carousel-caption text-start">
                            <h1>Example headline.</h1>
                            <p>Some representative placeholder content for the first slide of the carousel.</p>
                            <p><a className="btn btn-lg btn-primary" href="/">Sign up today</a></p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="https://nftia.infura-ipfs.io/ipfs/QmdnbtMxKRrGJ6GpqkU46JtGfH3sgWEyhZi2tT4XAsRNLv" alt="SecondArtCreation" className="imgTrending"/>
                    <div className="container">
                        <div className="carousel-caption">
                            <h1>Another example headline.</h1>
                            <p>Some representative placeholder content for the second slide of the carousel.</p>
                            <p><a className="btn btn-lg btn-primary" href="/">Learn more</a></p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="https://nftia.infura-ipfs.io/ipfs/QmTmxgu5HAsishnzdCJxEkTTt725TmsTFeg6dGzgKt33Nj" alt="SecondArtCreation" className="imgTrending"/>
                    <div className="container">
                        <div className="carousel-caption text-end">
                            <h1>One more for good measure.</h1>
                            <p>Some representative placeholder content for the third slide of this carousel.</p>
                            <p><a className="btn btn-lg btn-primary" href="/">Browse gallery</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
            </button>
        </div>
    </div>

    );
};

export default Trending;