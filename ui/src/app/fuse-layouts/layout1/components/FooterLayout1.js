import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';

function FooterLayout1(props) {
	const footerTheme = useSelector(({ fuse }) => fuse.settings.footerTheme);
	const year = new Date();
	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar id="fuse-footer" className="relative z-10" color="default">
				<Toolbar className="px-16 py-0 flex items-center">
					<Typography>{year.getFullYear()} - All Rights Reserved. www.1800Flood.com.au</Typography>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default FooterLayout1;
