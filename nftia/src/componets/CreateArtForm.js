
const CreateArtForm = () => {

    return (
        <div className='container'>
            <br/>
            <hr className="text-white" />
            <div className="container text-center">
                <h1 className="text-white">Would you like to make some Art?</h1>
                <br></br>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="setNameOfNFT" onChange={(e) => setNameOfNFT(e.target.value)} />
                    <label for="setNameOfNFT">Give A Name To Your Art, Ex: "My little Tomas"</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="setNFTPrompt" onChange={(e) => setNFTPrompt(e.target.value)}/>
                    <label for="setNFTPrompt">Please Write your art description, Ex: "little white sad cat sitting on a table with an apple" </label>
                </div>
                <button className="btn btn-outline-info btn-lg btn-block" onClick={() => mint()}>Create Art</button>
            </div>
            <br/>
            <hr className="text-white"/>
        </div>
    );
};

export default CreateArtForm;