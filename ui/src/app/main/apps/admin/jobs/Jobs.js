import FusePageCarded from '@fuse/core/FusePageCarded';
import React, { useEffect, useState } from 'react';
import JobsHeader from './JobsHeader';
import JobsTable from './JobsTable';

function JobsPage(props) {

	const [state, setState] = useState('');
	const [filter, setFilter] = useState('ALL');
	const handleSearch = e => {
		setState(e);
	};

	const onFilter = status => {
		setFilter(status);
	};
	
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				header: 'min-h-50 h-50 sm:h-80 sm:min-h-80'
			}}
			header={<JobsHeader onSearch={handleSearch} onFilter={onFilter} />}
			content={<JobsTable search={state} filter={filter} />}
			innerScroll
		/>
	);
}

export default JobsPage;
