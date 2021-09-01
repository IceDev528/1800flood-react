/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { IconButton, Icon } from '@material-ui/core';
import ApiService from 'app/services/ApiService';

export function AreaImages(props) {
	const { area, jobId } = props;
	const [state, setState] = useState([]);

	useEffect(() => {
		ApiService.getAreaImages(jobId, area.areaid).then(result => {
			setState(result.data);
		});
	}, [props]);

	const onDeleteClick = image => {
		ApiService.deleteImage(jobId, image.imageid).then(response => {
			setState(state.filter(s => s.imageid !== image.imageid));
		});
	};
	return (
		<div style={{ display: 'flex' }}>
			{(state || []).map(image => (
				<div style={{ padding: 10, display: 'inline' }}>
					<img src={image.location} width={200} height={200} />
					<IconButton
						onClick={() => {
							onDeleteClick(image);
						}}
					>
						<Icon>delete</Icon>
					</IconButton>
				</div>
			))}
		</div>
	);
}
