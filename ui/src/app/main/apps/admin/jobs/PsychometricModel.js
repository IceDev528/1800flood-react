import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import React, { useState, useEffect } from 'react';
import ApiService from 'app/services/ApiService';

function PsychometricModel(props) {
	const { areas, psychometrics, jobId, open } = props;
	const [list, setList] = useState(psychometrics);

	useEffect(() => {
		setList(psychometrics);
	}, [props]);

	const updateProgress = item => {
		const newList = list.map(a => {
			if (a.areaid === item.areaid) {
				return item;
			}
			return a;
		});
		setList(newList);
	};

	const handleClose = () => {
		props.onClose(list);
	};

	return (
		<Dialog onClose={handleClose} maxWidth="md" aria-labelledby="add-area-dialog" open={open}>
			<DialogTitle id="add-area-dialog-title">Area Progress</DialogTitle>
			<DialogContent>
				<Grid container>
					<Grid item xs={12}>
						<table cellPadding={5} cellSpacing={5}>
							<thead>
								<tr>
									<td>Area\Day</td>
									<td>Day 1</td>
									<td>Day 2</td>
									<td>Day 3</td>
									<td>Day 4</td>
									<td>Day 5</td>
									<td>Day 6</td>
									<td>Day 7</td>
									<td>Day 8</td>
									<td>Day 9</td>
									<td>Day 10</td>
									<td>Day 11</td>
								</tr>
							</thead>
							<tbody>
								{(list || []).map((item, index) => (
									<tr key={item.psychometricid} style={{ marginBottom: 5 }}>
										<td>{item.name}</td>
										<td>
											<TextField
												style={{ padding: 2 }}
												onChange={e => updateProgress({ ...item, day1: e.target.value })}
												size="small"
												type="number"
												label="Day1"
												variant="outlined"
												value={item.day1}
											/>
										</td>
										<td>
											<TextField
												style={{ padding: 2 }}
												onChange={e => updateProgress({ ...item, day2: e.target.value })}
												size="small"
												type="number"
												label="Day2"
												variant="outlined"
												value={item.day2}
											/>
										</td>
										<td>
											<TextField
												style={{ padding: 2 }}
												onChange={e => updateProgress({ ...item, day3: e.target.value })}
												size="small"
												type="number"
												label="Day3"
												variant="outlined"
												value={item.day3}
											/>
										</td>
										<td>
											<TextField
												style={{ padding: 2 }}
												onChange={e => updateProgress({ ...item, day4: e.target.value })}
												size="small"
												type="number"
												label="Day4"
												variant="outlined"
												value={item.day4}
											/>
										</td>
										<td>
											<TextField
												style={{ padding: 2 }}
												onChange={e => updateProgress({ ...item, day5: e.target.value })}
												size="small"
												type="number"
												label="Day5"
												variant="outlined"
												value={item.day5}
											/>
										</td>
										<td>
											<TextField
												style={{ padding: 2 }}
												onChange={e => updateProgress({ ...item, day6: e.target.value })}
												size="small"
												type="number"
												label="Day6"
												variant="outlined"
												value={item.day6}
											/>
										</td>
										<td>
											<TextField
												style={{ padding: 2 }}
												onChange={e => updateProgress({ ...item, day7: e.target.value })}
												size="small"
												type="number"
												label="Day7"
												variant="outlined"
												value={item.day7}
											/>
										</td>
										<td>
											<TextField
												style={{ padding: 2 }}	
												onChange={e => updateProgress({ ...item, day8: e.target.value })}
												size="small"
												type="number"
												label="Day8"
												variant="outlined"
												value={item.day8}
											/>
										</td>
										<td>
											<TextField
												style={{ padding: 2 }}
												onChange={e => updateProgress({ ...item, day9: e.target.value })}
												size="small"
												type="number"
												label="Day9"
												variant="outlined"
												value={item.day9}
											/>
										</td>
										<td>
											<TextField
												style={{ padding: 2 }}
												onChange={e => updateProgress({ ...item, day10: e.target.value })}
												size="small"
												type="number"
												label="Day10"
												variant="outlined"
												value={item.day10}
											/>
										</td>
										<td>
											<TextField
												style={{ padding: 2 }}
												onChange={e => updateProgress({ ...item, day11: e.target.value })}
												size="small"
												type="number"
												label="Day11"
												variant="outlined"
												value={item.day11}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="secondary" onClick={handleClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default PsychometricModel;
