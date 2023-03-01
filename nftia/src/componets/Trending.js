import './Trending.css';
import { useNavigate } from 'react-router-dom';


const Trending = () => {

    const navigate = useNavigate();
    
    const goToLogIn = () => {
        window.scrollTo(0, 0);
        const button = document.getElementById("signInUpButton");
        button.classList.add('blinking');
    }


    return (

    <div className="container">
        <hr></hr>
        <br/>
        <h1>Featured Art</h1>
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
                    <img src="/images/featured_3.jpg" alt="FirstArtCreation" className="imgTrending"/>
                    <div className="container">
                        <div className="carousel-caption text-start">
                            <h1 className="fw-bold">New Way to Make Art.</h1>
                            <p className="fw-bold">Unleash your creativity, create Digital Art.</p>
                            <p><a className="btn btn-lg btn-outline-light" href="#" onClick={() => goToLogIn()} >Sign up today</a></p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="/images/featured_1.jpg" alt="SecondArtCreation" className="imgTrending"/>
                    <div className="container">
                        <div className="carousel-caption">
                            <h1 className="text-white fw-bold">Unlimited Creativity.</h1>
                            <p className="text-white fw-bold">Experience the joy of creating, share your unique perspective, and make a lasting impact.</p>
                            <p><a className="btn btn-lg btn-outline-light" href="/marketplace">Browse MarketPlace</a></p>
                        </div>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="/images/featured_9.jpg" alt="SecondArtCreation" className="imgTrending"/>
                    <div className="container">
                        <div className="carousel-caption text-end">
                            <h1 className="text-dark fw-bold">Make a Difference.</h1>
                            <p className="text-dark fw-bold">Inspire and be inspired, create art that leave your mark.</p>
                            <p><a className="btn btn-lg btn-outline-dark" href="/blog/ia-art-nft-how-it-works">Check How it Works</a></p>
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