import React, { Component } from 'react';
import axios from 'axios';

class CheckSum extends Component {
    constructor(props) {
        super(props);
        this.state={
            file_name_orginal: "Choose orginal file to check integrity",
            file_name_decrypted: "Choose file after decrypted to check integrity",
            file_orginal: null,
            file_decrypted: null,
            checked_result: null,
            hash_result_file_original: null,
            hash_result_file_decrypted: null,
            name_result_file_original: null,
            name_result_file_decrypted: null,
            isLoading:false,
            bgResult: null,
            time: 0,
            modeHash: 'sha256'
        }
    }

    isChangeOriginalFile = (event) => {
        const file = event.target.files[0];

        this.setState({
            file_name_orginal: file.name,
            file_orginal: file,
        });
    }

    isChangeDecryptedFile = (event) => {
        const file = event.target.files[0];

        this.setState({
            file_name_decrypted: file.name,
            file_decrypted: file
        });
    }

    isChangeModeHash = (event) => {
        const value = event.target.value;
        this.setState({
            modeHash: value
        });
    }

    isShowButton = () => {
        if(this.state.file_orginal && this.state.file_decrypted){
            return (
                <button onClick={this.handleButtonClick} className="btn btnbackground mr-3">Submit</button>
            );
        }
    }

    isShowCheckedResult = () => {
        if(this.state.checked_result){
            return (
                // <div className={`showPathToView mb-5 ` + this.state.bgResult}>
                <div className="mt-5 mb-5">
                    <h3 className="mb-2">{this.state.checked_result}</h3>
                    <div className="form-group wrapfileEncrypt">
                        <div>
                            <p className="m-0">Hash result of file <span className="color-file-name">{this.state.file_name_orginal}</span> is:</p>
                            <p className="mb-2">{this.state.hash_result_file_original}</p>
                        </div>
                    </div>
                    <div className="form-group wrapfileEncrypt">
                        <div>
                            <p className="m-0">Hash result of file <span className="color-file-name">{this.state.file_name_decrypted}</span> is:</p>
                            <p className="mb-2">{this.state.hash_result_file_decrypted}</p>
                        </div>
                    </div>
                    <div className="form-group wrapfileEncrypt">
                        <p className="m-0">Time to complete: {this.state.time / 1000} s</p>
                    </div>
                </div>
            );
        }
    }

    isShowLoading = () => {
        if(this.state.isLoading){
            return (
                <div className="text-center mt-5">
                    <div className="spinner-border text-danger" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <div>Time: {this.state.time / 1000} s</div>
                </div>
            );
        }
    }

    handleButtonClick = (event) => {
        event.preventDefault();
        this.setState({
            isLoading:true,
            checked_result:null,
            time: 0
        });

        this.timer = setInterval(() => this.setState({
            time: this.state.time + 10
        }), 10);

        let formData = new FormData();
        formData.append('file_to_check_integrity',this.state.file_orginal);
        formData.append('file_to_check_integrity',this.state.file_decrypted);
        axios.post(`/checkintegrity/${this.state.modeHash}`,formData)
        .then((response) => {
            if(response.data.result){
                this.setState({
                    checked_result: response.data.message,
                    hash_result_file_original: response.data.hashFile1,
                    hash_result_file_decrypted: response.data.hashFile2,
                    isLoading:false,
                    bgResult: "bg-success"
                });
            }
            else{
                this.setState({
                    checked_result: response.data.message,
                    hash_result_file_original: response.data.hashFile1,
                    hash_result_file_decrypted: response.data.hashFile2,
                    isLoading:false,
                    bgResult: "bg-failed"
                });
            }
            clearInterval(this.timer);
        })
        .catch((err) => {
        
        })
    }
    
    reset = (event) => {
        event.preventDefault();
        window.location.reload();
    }

    render() {
        return (
            <div className="container d-flex justify-content-center">
                <div className="col-xl-8 col-lg-8 col-md-11 col-12">
                    <form encType="multipart/form-data">
                        <div className="form-group wrapfileEncrypt">
                            <div className="textfileEncrypt">
                                <p className="m-0">{this.state.file_name_orginal}</p>                                
                            </div>
                            <label className="labelfileEncrypt" htmlFor="exampleInputEmail1"><i className="fas fa-upload"></i></label>
                            <input onChange={(event) => {this.isChangeOriginalFile(event)}} type="file" name="original_file" className="form-control d-none" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                        </div>
                        <div className="form-group wrapfileEncrypt">
                            <div className="textfileEncrypt">
                                <p className="m-0">{this.state.file_name_decrypted}</p>                                
                            </div>
                            <label className="labelfileEncrypt" htmlFor="exampleInputEmail2"><i className="fas fa-upload"></i></label>
                            <input onChange={this.isChangeDecryptedFile} type="file" name="file_after_decrypt" className="form-control d-none" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email" />
                        </div>
                        <div className="form-group ">
                            <label htmlFor="exampleFormControlSelect1">Choose mode hash</label>
                            <select onChange={this.isChangeModeHash} name="modeHash" className="form-control wrapfileEncrypt" id="exampleFormControlSelect1">
                                <option value="sha256">SHA-256</option>
                                <option value="sha1">SHA-1</option>
                                <option value="md5">MD5</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-center">
                            {
                                this.isShowButton()
                            }
                            <button onClick={this.reset} className="btn btnbackground">Reset</button>
                        </div>
                    </form>
                    {
                        this.isShowCheckedResult()
                    }
                    {
                        this.isShowLoading()
                    }
                </div>
            </div>
        );
    }
}

export default CheckSum;