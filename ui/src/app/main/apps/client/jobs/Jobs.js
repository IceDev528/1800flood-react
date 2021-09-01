import FusePageCarded from '@fuse/core/FusePageCarded';
import React, { useState } from 'react';
import JobsHeader from './JobsHeader';
import JobsTable from './JobsTable';

function JobsPage(props) {

	const [search, setSearch] = useState('');

	const handleSearch = value => {
		setSearch(value);
	};
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={<JobsHeader onSearch={handleSearch} />}
			content={<JobsTable search={search} />}
			innerScroll
		/>
	);
}

export default JobsPage;
