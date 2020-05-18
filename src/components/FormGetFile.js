import React, { Component } from 'react';
import axois from 'axios';

class FormGetFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData :null,
            link_to_show: null,
            content_key: false,
            text_show_file_crypt: "Choose file to encrypt/decrypt",
            text_show_file_key: "Choose key file",
            route_post : null,
            type_algorithm: "kriptaes",
            type_mode: "encrypt",
            status_decrypt: true
        }
    }

    isChange = (event) => {
        const value = event.target.files;
        const value_name = value.length <= 1 ?value[0].name : value.length + " files are chosen";
        var formData;

        if(this.state.formData){
            formData = this.state.formData;
        }
        else{
            formData = new FormData();
        }

        for(var i = 0; i < value.length;i++){
            formData.append("file_to_encrypt",value[i]);
        }
        this.setState({
            formData: formData,
            text_show_file_crypt: value_name
        });
        console.log(event.target.files);
    }

    isChangeFileKey = (event) => {
        const value = event.target.files[0];
        if (value.type !== 'text/plain'){
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
            formData.append("content_key",event.target.result)
            this.setState({
                formData: formData,
                text_show_file_key: value.name,
                content_key: true
            });
        }
        reader.readAsText(value);
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
        if(this.state.link_to_show && this.state.status_decrypt){
            return (
                <div className="showPathToView">
                    <p>Please enter into folder follow link behind to view result:</p>
                    <p>{this.state.link_to_show}</p>
                </div>
            );
        }
        else if(this.state.link_to_show && !this.state.status_decrypt){
            return (
                <div className="showPathToView">
                    <h3>Error !!!</h3>
                    <p>{this.state.link_to_show}</p>
                </div>
            );
        }
    }

    handleButtonClick = (event) => {
        event.preventDefault();

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axois.post(`/${this.state.type_mode}`,this.state.formData,config).then((respone) => {
            var newPath = respone.data.split('\\');
            if(newPath.length === 1){
                this.setState({
                    link_to_show: newPath[0],
                    status_decrypt:false
                });
            }
            else{
                var result_path = "";
                for(var i = 0; i < newPath.length - 2; i++){
                    result_path += newPath[i] + "/";
                }
                result_path += newPath[newPath.length - 2];
                this.setState({
                    link_to_show: result_path
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    
    render() {
        return (
            <div className="container d-flex justify-content-center">
                <div className="col-xl-8 col-lg-8 col-md-11 col-12">
                    <form encType="multipart/form-data">
                        <div className="form-group wrapfileEncrypt">
                            <span className="textfileEncrypt">{this.state.text_show_file_crypt}</span>
                            <label className="labelfileEncrypt" htmlFor="exampleInputEmail1"><i className="fas fa-upload"></i></label>
                            <input multiple onChange={(event) => {this.isChange(event)}} type="file" name="file_to_encrypt" className="form-control d-none" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                        </div>
                        <div className="form-group wrapfileEncrypt">
                            <span className="textfileEncrypt">{this.state.text_show_file_key}</span>
                            <label className="labelfileEncrypt" htmlFor="exampleInputEmail2"><i className="fas fa-upload"></i></label>
                            <input onChange={this.isChangeFileKey} type="file" name="file_key" className="form-control d-none" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email" />
                        </div>
                        <div className="form-group ">
                            <label htmlFor="exampleFormControlSelect1">Choose algorithm</label>
                            <select onChange={this.isChangeType} name="type_algorithm" className="form-control wrapfileEncrypt" id="exampleFormControlSelect1">
                                <option value="kriptaes">KriptaAES</option>
                                <option value="kriptarsa">KriptaRSA</option>
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
                            <button className="btn btnbackground">Reset</button>
                        </div>
                    </form>
                    {
                        this.isShowPathToView()
                    }
                </div>
            </div>
        );
    }
}

export default FormGetFile;