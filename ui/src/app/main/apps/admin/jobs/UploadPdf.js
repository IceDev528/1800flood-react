import React, { useState, useEffect } from 'react';
import { Input, Button } from '@material-ui/core';
import ApiService from 'app/services/apiService';


function DownloadFile(props) {
	const {jobId} = props;
	const [url, setUrl] = useState('');

	useEffect(() => {
		ApiService.getJobBills(jobId).then((response) => {
			const bills = response.data;
			console.log(bills);
			setUrl(bills[0].pdflocation);
		})
	}, [props])
	return(
		<divv>
			{url !== '' ?
				(<form method="get" action={url}>
					<button type="submit">Download Invoice</button>
				</form>) : 
				(
					<div>No file for download</div>
				)
			}
		</divv>
	)
}

function UploadPdf(props) {
	const { jobId } = props;
	const [state, setState] = useState({ selectedFile: {}, loaded: 0, jobId: 0 });
	const [uploaded, setUploaded] = useState({ filename: null, size: '', type: 'PDF' });
	const [pdfFile, setPdfFile] = useState([]);
	useEffect(() => {
		setState({ ...state, jobId: props.jobId });
	}, [props]);

	const onChangeHandler = event => {
		event.preventDefault();
		console.log(event.target.files[0]);
		const data = new FormData();
		data.append('file', event.target.files[0]);
		console.log(data);
		ApiService.uploadPdf(jobId, data)
			.then(data => {
				setPdfFile(data.data.Location);
			})
			.catch(err => {
				console.log('error');
			});
	};

	const onClickHandler = event => {
		const data = new FormData();
		data.append('file', state.selectedFile);
		console.log(JSON.stringify(state.selectedFile));
		ApiService.uploadPdf(jobId, data)
			.then(data => {
				setPdfFile(data.data.Location);
			})
			.catch(err => {
				console.log('error');
			});
	};

	return (
		<div>
			<DownloadFile jobId={jobId}/>
			<Input type="file" name="file" onChange={onChangeHandler} />
			<button type="button" className="btn btn-success btn-block" onClick={onClickHandler}>
				Upload
			</button>
		</div>
	);
}

export default UploadPdf;
