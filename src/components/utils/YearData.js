import React, { useState, useEffect } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PieChart from '../charts/PieChart';
import SectorCheckbox from './CheckBox';

const YearData = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [yearsData, setYearsData] = useState({});
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(true);
    const open = Boolean(anchorEl);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/filterData?startYear=`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            const filteredData = jsonData.filter(item => item.start_year !== null);
            const processedData = processData(filteredData);
            setYearsData(processedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const processData = (data) => {
        const startYearCounts = {};
        data.forEach(item => {
            const startYear = item.start_year;
            if (startYear !== null && startYear !== '') {
                startYearCounts[startYear] = startYearCounts[startYear] ? startYearCounts[startYear] + 1 : 1;
            }
        });
        return startYearCounts;
    };

    const handleYearChange = (selectedYear) => {
        setSelectedYear(selectedYear);
    };

    return (
        <div className="w-full overflow-hidden relative">
            <div className='h-[2rem] w-full flex m-2 justify-between items-center'>
                <div>
                    <h2 className='text-gray-500 text-xl font-semibold text-left'>Start Year</h2>
                </div>
                <div>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        getContentAnchorEl={null}
                        elevation={0}

                    >
                        <MenuItem key="1" onClick={handleClose}>View</MenuItem>
                        <MenuItem key="2" onClick={handleClose}>Link</MenuItem>
                        <MenuItem key="3" onClick={handleClose}>View</MenuItem>
                    </Menu>
                </div>
            </div>
            {loading ? (
                <div className='flex justify-center items-center'>Loading...</div>
            ) : (
                <div className='flex flex-col md:flex-row'>
                    <div className='w-full md:w-1/3 h-[20rem] overflow-x-hidden overflow-y-auto m-3'>
                        {Object.keys(yearsData).map(year => (
                            <div key={year}>
                                <SectorCheckbox
                                    sector={year}
                                    value={year}
                                    selectedSector={selectedYear}
                                    handleSectorChange={handleYearChange}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='w-full md:w-2/3 h-[16rem] flex justify-center'>
                        <PieChart selectedYear={selectedYear} yearData={yearsData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default YearData;
