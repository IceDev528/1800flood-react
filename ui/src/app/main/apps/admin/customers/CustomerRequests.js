import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseUtils from '@fuse/utils';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from 'react-table';
import RequestMultiSelectMenu from './RequestMultiSelectMenu';

function CustomerRequests(props) {
  const dispatch = useDispatch();
	const customers = useSelector(({ customerApp }) => customerApp.customers);
	const selectedRequestIds = useSelector(({ customerApp }) => customerApp.selectedRequestIds);
	const [filteredData, setFilteredData] = useState(null);

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={300}>
			<ReactTable
				className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
				getTrProps={(state, rowInfo, column) => {
					return {
						className: 'cursor-pointer',
						onClick: (e, handleOriginal) => {
              console.log(e);
						}
					};
				}}
				data={filteredData}
				columns={[
					{
						Header: () => (
							<Checkbox
								onClick={event => {
									event.stopPropagation();
								}}
								onChange={event => {
									// return event.target.checked
									// 	? dispatch(Actions.selectAllContacts())
									// 	: dispatch(Actions.deSelectAllContacts());
								}}
								checked={
									selectedRequestIds.length === Object.keys(customers).length &&
									selectedRequestIds.length > 0
								}
								indeterminate={
									selectedRequestIds.length !== Object.keys(customers).length &&
									selectedRequestIds.length > 0
								}
							/>
						),
						accessor: '',
						Cell: row => {
							return (
								<Checkbox
									onClick={event => {
										event.stopPropagation();
									}}
									checked={selectedRequestIds.includes(row.value.id)}
								/>
							);
						},
						className: 'justify-center',
						sortable: false,
						width: 64
					},
					{
						Header: () => selectedRequestIds.length > 0 && <RequestMultiSelectMenu />,
						accessor: 'avatar',
						Cell: row => <Avatar className="mx-8" alt={row.original.name} src={row.value} />,
						className: 'justify-center',
						width: 64,
						sortable: false
					},
					{
						Header: 'First Name',
						accessor: 'name',
						filterable: true,
						className: 'font-bold'
					},
					{
						Header: 'Last Name',
						accessor: 'lastName',
						filterable: true,
						className: 'font-bold'
					},
					{
						Header: 'Company',
						accessor: 'company',
						filterable: true
					},
					{
						Header: 'Job Title',
						accessor: 'jobTitle',
						filterable: true
					},
					{
						Header: 'Email',
						accessor: 'email',
						filterable: true
					},
					{
						Header: 'Phone',
						accessor: 'phone',
						filterable: true
					},
					{
						Header: '',
						width: 128,
						Cell: row => (
							<div className="flex items-center">
								<IconButton
									onClick={ev => {
										ev.stopPropagation();
									}}
								>
									<Icon>star_border</Icon>
								</IconButton>
								<IconButton
									onClick={ev => {
										ev.stopPropagation();
									}}
								>
									<Icon>delete</Icon>
								</IconButton>
							</div>
						)
					}
				]}
				defaultPageSize={10}
				noDataText="No contacts found"
			/>
		</FuseAnimate>
  )
}

export default CustomerRequests;
