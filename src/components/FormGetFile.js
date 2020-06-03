import React, { Component } from 'react';
import axois from 'axios';

class FormGetFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData :null,
            link_to_show: null,
            content_key: false,
            text_show_file_crypt: ["Choose file to encrypt/decrypt"],
            text_show_file_key: "Choose key file",
            route_post : null,
            type_algorithm: "aes_algorithm",
            type_mode: "encrypt",
            status_decrypt: true,
            text_title_alarm: "",
            isLoadingResult:false,
            bgResult:null,
            time: 0,
            modeupfile: false,
            totalSize: 0
        }
    }

    isChange = (event) => {
        var value = event.target.files;
        // var value_name = value.length <= 1 ? value[0].name : value.length + " files are chosen";
        var value_name=[];
        let totalSize = 0;
        for(var j = 0; j < value.length; j++){
            value_name.push(value[j].name);
            totalSize += value[j].size;
        }
        
        let formData;

        if(this.state.formData && this.state.content_key){
            formData = this.state.formData;
            formData.delete("file_to_encrypt");
        }
        else{
            formData = new FormData();
        }

        for(var i = 0; i < value.length;i++){
            formData.append("file_to_encrypt",value[i]);
        }
        this.setState({
            formData: formData,
            text_show_file_crypt: value_name,
            totalSize: totalSize
        });
    }

    isChangeFileKey = (event) => {
        const value = event.target.files[0];
        if (value && value.type !== 'text/plain'){
            alert("Please choose key file as text file");
            return;
        }
        if(!this.state.formData){
            this.setState({
                formData : new FormData()
            });
        }
        let reader = new FileReader();
        reader.onload = (event) => {   
            var formData = this.state.formData;
            formData.delete("content_key");
            formData.append("content_key",event.target.result)
            this.setState({
                formData: formData,
                text_show_file_key: value.name,
                content_key: true
            });
        }
        if(value){
            reader.readAsText(value);
        }
    }

    isChangeType = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]:value
        });
    }

    isShowButton = () => {
        if(this.state.formData && this.state.content_key){
            return (
                <button onClick={this.handleButtonClick} className="btn btnbackground mr-3">Submit</button>
            );
        }
    }

    isShowPathToView = () => {
        const totalSize = (Math.round(this.state.totalSize / 1024 * 100)/100).toFixed(2);
        const speed = (this.state.totalSize / 1024) / (this.state.time / 1000);
        const realSpeed = (Math.round(speed*100)/100).toFixed(2);
        if(this.state.link_to_show && this.state.status_decrypt){
            return (
                <div className={`showPathToView mb-5 ` + this.state.bgResult}>
                    <p>{this.state.text_title_alarm}</p>
                    <p>{this.state.link_to_show}</p>
                    <p>Time to complete: {this.state.time/1000} s</p>
                    <p>Total size of these file: {totalSize} KB</p>
                    <p>Speed of process: {realSpeed} KB/s</p>
                </div>
            );
        }
        else if(this.state.link_to_show && !this.state.status_decrypt){
            return (
                <div className={`showPathToView mb-5 ` + this.state.bgResult}>
                    <p>{this.state.text_title_alarm}</p>
                    <p>{this.state.link_to_show}</p>
                    <p>Time to complete: {this.state.time/1000} s</p>
                </div>
            );
        }
    }

    isShowLoadingResult = () => {
        if(this.state.isLoadingResult){
            return (
                <div className="text-center mt-5">
                    <div className="spinner-border text-danger" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <div>Time: {this.state.time/1000} s</div>
                </div>
            );
        }
    }

    isShowModeUpFile = () => {
        if(this.state.modeupfile){
            return (
                <input directory="" webkitdirectory="" multiple onChange={(event) => {this.isChange(event)}} type="file" name="file_to_encrypt" className="form-control d-none" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            );
        }
        else{
            return (
                <input multiple onChange={(event) => {this.isChange(event)}} type="file" name="file_to_encrypt" className="form-control d-none" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            );
        }
    }

    onClickSwitchUpFileMode = () => {
        this.setState({
            modeupfile: !this.state.modeupfile
        });
    }

    handleButtonClick = (event) => {
        event.preventDefault();
        this.setState({
            isLoadingResult: true,
            link_to_show: null,
            time: 0
        });
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        this.timer = setInterval(() => this.setState({
            time: this.state.time + 100
        }), 100);


        axois.post(`/${this.state.type_mode}/${this.state.type_algorithm}`,this.state.formData,config).then((respone) => {
            var newPath = respone.data.split('\\');
            if(newPath.length === 1){
                this.setState({
                    link_to_show: newPath[0],
                    status_decrypt:false,
                    text_title_alarm: "Error!!!",
                    isLoadingResult: false,
                    bgResult: "bg-failed"
                });
            }
            else{
                var result_path = "";
                for(var i = 0; i < newPath.length - 2; i++){
                    result_path += newPath[i] + "/";
                }
                result_path += newPath[newPath.length - 2];
                this.setState({
                    link_to_show: result_path,
                    text_title_alarm: "Please enter into folder follow link under to view result!",
                    isLoadingResult: false,
                    bgResult: "bg-success"
                });
            }
            clearInterval(this.timer);
        }).catch((error) => {
            console.log(error);
        });
    }

    reset = (event) => {
        event.preventDefault();
        window.location.reload();
    }
    
    render() {
        return (
            <div className="container d-flex justify-content-center mb-5">
                <div className="col-xl-8 col-lg-8 col-md-11 col-12">
                    <div className="form-group wrapfileEncrypt">
                        <h5 className="m-0">Mode: {this.state.modeupfile ? 'upload folder':'upload mutiple file'}</h5>
                        <button onClick={this.onClickSwitchUpFileMode} className="btn bg-failed text-white">Switch mode</button>
                    </div>
                    <div className="form-group">
                    </div>
                    <form encType="multipart/form-data">
                        <div className="form-group wrapfileEncrypt">
                            <div className="textfileEncrypt">
                                {
                                    this.state.text_show_file_crypt.map((value,key) => {
                                        return (
                                            <p className="seperate_line" key={key}>{value}</p>
                                        )
                                    })
                                }
                            </div>
                            <label className="labelfileEncrypt" htmlFor="exampleInputEmail1"><i className="fas fa-upload"></i></label>
                            {
                                this.isShowModeUpFile()
                            }
                        </div>
                        <div className="form-group wrapfileEncrypt">
                            <span className="textfileEncrypt">{this.state.text_show_file_key}</span>
                            <label className="labelfileEncrypt" htmlFor="exampleInputEmail2"><i className="fas fa-upload"></i></label>
                            <input onChange={this.isChangeFileKey} type="file" name="file_key" className="form-control d-none" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email" />
                        </div>
                        <div className="form-group ">
                            <label htmlFor="exampleFormControlSelect1">Choose algorithm</label>
                            <select onChange={this.isChangeType} name="type_algorithm" className="form-control wrapfileEncrypt" id="exampleFormControlSelect1">
                                <option value="aes_algorithm">AES Algorithm</option>
                                <option value="rsa_algorithm">RSA Algorithm</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Choose mode</label>
                            <select onChange={this.isChangeType} name="type_mode" className="form-control wrapfileEncrypt" id="exampleFormControlSelect1">
                                <option value="encrypt">Encrypt</option>
                                <option value="decrypt">Decrypt</option>
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
                        this.isShowPathToView()
                    }
                    {
                        this.isShowLoadingResult()
                    }
                </div>
            </div>
        );
    }
}

export default FormGetFile;