import React, { Component } from 'react'
import { FileDrop } from 'react-file-drop'
import { saveAs } from 'file-saver'

import './CSVController.css'

class CSVController extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            uploadedCsv:[],
            currentCsvContent:{
                "table_header":"",
                "rows":[[]]
            },
            currentCsvStatistics:{
                "table_header":"",
                "rows":[[]]
            }
        }
    }

    uploadCSV(file_name,csv_body) {
        return fetch('/'+file_name+'/upload/', {
            method:'POST',
            headers: {
                'Content-type':'csv'
            },
            body: csv_body,
        }).then(res=>console.log(res))
    }

    downloadCSV(e) {
        var file_name = e.target.value
        return fetch('/'+file_name+'/download/')
        .then(res=> res.text()).then(text=>{
            var blob = new Blob([text], {type: "csv"})
            saveAs(blob, file_name)
        })
    }

    displayCSVContent(file_name,csv_body) {
        var lines = csv_body.split("\n")
        var rows=[[]]
        for(var i=0;i<5; i++){
            rows.push([])
            var cols=lines[i].split(",")
            for(var j=0; j<cols.length; j++){
                rows[i].push(cols[j])
            }
        }

        this.setState({currentCsvContent:{"table_header":"Contents of "+file_name,
    "rows":rows}})
    }

    displayCSVStatistics(file_name,csv_body) {
        var lines=csv_body.split("\n")
        var rows=[[]]
        for(var i=1;i<lines.length;i++){
            rows.push([])
            var cols=lines[i].split(",")
            for(var j=0; j<cols.length; j++){
                rows[i].push(cols[j])
            }
        }
        this.setState({currentCsvStatistics:{"table_header":"Total entries per year for "+file_name,
    "rows":rows}})
    }

    getCSVContent(e) {
        var file_name=e.target.value
        return fetch('/'+file_name)
        .then(res=> res.text()).then( text=>{
            this.displayCSVContent(file_name,text)
        })
    }

    getCSVStatistics(e) {
        var file_name = e.target.value
        return fetch('/'+file_name+'/statistics/')
        .then(res=> res.text()).then( text=>{
            this.displayCSVStatistics(file_name, text)
        })
    }

    onDropFunction(files) {
        for(var i in files){
            var file_type=files[i].type
            var file_name=files[i].name
            if( file_type === "text/csv"){
                var csv_list=this.state.uploadedCsv
                csv_list.push({"file_name":file_name})
                this.setState({uploadedCsv:csv_list})
                this.uploadCSV(file_name, files[i])
            } else{ 
                console.log("provide valid file type")
            }
        }
    }

    render() {
        return (
            <div className="controller-wrapper">
                <div className="drop-and-list-container">
                        <div className="file-drop-container">
                            <FileDrop 
                                    onFrameDragEnter={(event) => console.log('onFrameDragEvent',event)}
                                    onFrameDragLeave={(event) => console.log('onFrameDragEvent',event)}
                                    onFrameDrop={(event) => console.log('onFrameDropEvent', event)}
                                    onDragOver={(event) => console.log('onDragOverEvent', event)}
                                    onDragLeave={(event) => console.log('onDragLeaveEvent', event)}
                                    onDrop={(files, event) => this.onDropFunction(files)}
                                    >
                                        Drop csv here!
                                    </FileDrop>
                        </div>
                        <div className="csv-list-container">
                            <h1>Uploaded CSVs</h1>
                            <div className="csv-list">
                            { this.state.uploadedCsv.map((item)=> (
                                <div>
                                    <button id="csv-button" value={item["file_name"]} onClick={this.getCSVContent.bind(this)}>{item["file_name"]}</button>
                                    <button id="download-button" value={item["file_name"]} onClick={this.downloadCSV.bind(this)}>download</button>
                                    <button id="statistics-button" value={item["file_name"]} onClick={this.getCSVStatistics.bind(this)}>statistics</button>
                                </div>
                            ))} 
                            <hr />
                            </div>
                        </div>
                </div>
                <div className="display-container">
                    <h2>{this.state.currentCsvContent["table_header"]}</h2>
                    <div className="display-tables">
                        <table>
                            <tbody>
                                {this.state.currentCsvContent["rows"].map((row)=>(
                                    <tr>
                                    {row.map((colValue)=>(
                                        <td>{colValue}</td>
                                    ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h2>{this.state.currentCsvStatistics["table_header"]}</h2>
                    <div className="display-tables">
                        <table>
                            <tbody>
                                {this.state.currentCsvStatistics["rows"].map((row)=>(
                                    <tr>
                                    {row.map((colValue)=>(
                                        <td colspan="2">{colValue}</td>
                                    ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        )
    }
}
export default CSVController