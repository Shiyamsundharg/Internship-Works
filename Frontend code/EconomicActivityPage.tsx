// Version : 0.0.4
// Author : VISHAL,ARANVINDHAN,VISHNU
// LastEdit : SHIYAM
// Last ADD : swalComponent changed to show notification and notification message changes done
// MODFIED DATE : 11-08-2025

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Badge from '../../../components/bootstrap/Badge';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Card, {
	CardBody,
	CardLabel,
	CardFooter,
	CardHeader,
	CardActions,
} from '../../../components/bootstrap/Card';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import Page from '../../../layout/Page/Page';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import { PER_COUNT } from '../../../components/PaginationButtons';
import CommonTable from '../../_common/table/TableComponent';
import Pagination from '../../_common/Pagination';
import AddEconomicActivityComponent from './add-economicActivity/AddEconomicActivityComponent';
import { isEditDetailsStart } from '../../../redux/general/general.action';
import {
	getEconomicActivityListStart,
	getEconomicActivityListResponseResetStart,
	fetchEconomicActivityDetailsStart,
	deleteEconomicActivityDetailsStart,
	deleteEconomicActivityDetailsResponseResetStart,
} from '../../../redux/master/economicActivity/economicActivity.action';
import { getLoginObjDetails } from '../../../redux/login/login.selector';
import { selectEditDetails } from '../../../redux/general/general.selector';
import {
	selectEconomicActivityListGetResponse,
	selectEconomicActivityListData,
	selectDeleteEconomicActivityResponse,
} from '../../../redux/master/economicActivity/economicActivity.selector';
import '../../../styles/common/_common.scss';
import TableSpinner from '../../_common/table/TableSpinner';
import showAlert from '../../_common/SwalAlert';
import generalLoadUserControl from '../../../common/function/generalLoadUserControl';
import CommonAuthenticationModal from '../../_common/CommonAuthenticationModal';
import showNotification from '../../../components/extras/showNotification';
import {
	fetchAllEconomicActivityTypeResponseResetStart,
	fetchAllEconomicActivityTypeStart,
} from '../../../redux/master/economic-activity-type/economic-activity-type.action';
import { selectAllEconomicActivityTypeFetchResponse } from '../../../redux/master/economic-activity-type/economic-activity-type.selector';
const EconomicActivityComponent = () => {
	const dispatch = useDispatch();

	/****** LOGIN DATA **********/
	const loginData = useSelector(getLoginObjDetails);

	/****** FETCH ECONOMIC ACTIVITY LIST  **********/
	const economicActivityListResp = useSelector(selectEconomicActivityListGetResponse);
	const economicActivityListArr = useSelector(selectEconomicActivityListData);

	/****** DELETE ECONOMIC ACTIVITY  **********/
	const economicActivityDeleteResp = useSelector(selectDeleteEconomicActivityResponse);

	/****** FETCH ALL ECONOMIC ACTIVITY TYPE  **********/
	const fetchEconomicActivityTypeResp = useSelector(selectAllEconomicActivityTypeFetchResponse);

	//AUTHMODAL USESTATE
	const [authModal, setAuthModal] = useState(false);

	//INPUT SERACH USESTATE
	const [inputSearch, serSearchValueSet] = useState('');
	const isEdit = useSelector(selectEditDetails);

	//PAGE USESTATE
	const [currentPage, setCurrentPage] = useState(1);
	const [pevPage, setPevPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['20']);
	const [isSpinner, isShowSpinner] = useState(false);

	//ISNEW USESTATE
	const [isNew, setIsNew] = useState(false);

	//ECONOMICACTIVITYDETAILS COUNT USESTATE
	const [economicActivityDetails, setEconomicActivityDetails] = useState({
		totalCount: 0,
	});

	//AUTHDATA USESTATE
	const [authData, setAuthData] = useState<{
		EconomicActivityID: string;
		EconomicActivityName: string;
	} | null>(null);
	const { totalCount } = economicActivityDetails;
	const {
		companyID,
		userID,
		userName,
		userAccessBranchID,
		databaseName,
		isAuthenticationNeeded,
	} = loginData;

	const usercontrolaccess = generalLoadUserControl('Master', 'Economic Activity', loginData);
	const { isShowAdd, isShowEdit, isShowDelete } = usercontrolaccess;

	const initalData = {
		companyID,
		limit: 0,
		inputSearch: '',
		databaseName,
	};
	//Notification alert handler function
	function swalComponent(title: string, text: string, icon: any) {
		showAlert({ title, text, icon });
	}

	// On Load EconomicActivity List
	function onLoanEconomicActivityList() {
		isShowSpinner(true);
		setEconomicActivityDetails({
			...economicActivityDetails,
		});
		dispatch(isEditDetailsStart(false));
		dispatch(getEconomicActivityListStart(initalData));
	}

	// INITIAL API CALL
	useEffect(() => {
		isShowSpinner(true);
		onLoanEconomicActivityList();
	}, []);

	// USE HANDLE RESPONSE IN USEEFFECT
	useEffect(() => {
		// Get Economic Activity type List Resp
		if (economicActivityListResp !== null && economicActivityListResp !== undefined) {
			if (economicActivityListResp.statusCode === '01') {
				isShowSpinner(false);
				const { totalEconomicActivityCount } = economicActivityListResp;
				setEconomicActivityDetails({
					...economicActivityDetails,
					totalCount: Number(totalEconomicActivityCount),
				});
			} else if (economicActivityListResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			isShowSpinner(false);
			dispatch(getEconomicActivityListResponseResetStart());
		}

		// Delete Economic Activity type Resp
		if (economicActivityDeleteResp !== null && economicActivityDeleteResp !== undefined) {
			if (economicActivityDeleteResp.statusCode === '01') {
				isShowSpinner(true);
				swalComponent(
					'You’re Good to Go!',
					'EconomicActivity Details Deleted Successfully',
					'success',
				);
				onLoanEconomicActivityList();
			} else if (economicActivityDeleteResp.statusCode === '100') {
				swalComponent('Aborted!', 'Let’s give it another go', 'danger');
			} else if (economicActivityDeleteResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			dispatch(deleteEconomicActivityDetailsResponseResetStart());
		}
		// FETCH ALL ECONOMIC ACTIVITY RESP
		if (fetchEconomicActivityTypeResp !== null && fetchEconomicActivityTypeResp !== undefined) {
			dispatch(fetchAllEconomicActivityTypeResponseResetStart());
		}

		// pagination Function
		if (pevPage !== currentPage) {
			setPevPage(currentPage);
			const limitCount = currentPage * 20 - 20;
			initalData.limit = limitCount;
			onLoanEconomicActivityList();
		}
	}, [economicActivityListResp, economicActivityDeleteResp, currentPage]);

	// Handle edit Function
	function handleEdit(economicActivityID: any) {
		const data = {
			companyID,
			economicActivityID,
			databaseName,
		};
		dispatch(fetchEconomicActivityDetailsStart(data));
		openEdit();
		setIsNew(false);
	}

	// Handle delete function
	function handleDelete(item: any) {
		const { EconomicActivityID, EconomicActivityName } = item;
		if (parseFloat(item.EconomicActivityExist) > 0) {
			swalComponent('warning !', 'Economic Activity Exist in Member', 'warning');
		} else {
			showAlert({
				title: 'Are you sure?',
				text: 'Once deleted, you will not be able to recover this Economic Activity!',
				icon: 'warning',
				confirmButtonText: 'Yes!',
				showCancelButton: true,
			}).then((result) => {
				if (result.isConfirmed) {
					if (isAuthenticationNeeded === '1') {
						setAuthData(item);
						setAuthModal(true);
					} else {
						const data = {
							companyID,
							economicActivityID: EconomicActivityID,
							economicActivityName: EconomicActivityName,
							databaseName,
							userAccessBranchID,
							userID,
							userName,
						};
						dispatch(deleteEconomicActivityDetailsStart(data));
					}
				}
			});
		}
	}

	// openEdit Function
	function openEdit() {
		if (isNew && isEdit) {
			showAlert({
				title: 'Are you sure?',
				text: 'Do you want to Leave without saving',
				icon: 'warning',
				confirmButtonText: 'Yes!',
				showCancelButton: true,
			}).then((result) => {
				if (result.isConfirmed) {
					dispatch(isEditDetailsStart(!isEdit));
					if (inputSearch != '') {
						serSearchValueSet('');
						onLoanEconomicActivityList();
					}
				}
			});
		} else {
			dispatch(fetchAllEconomicActivityTypeStart(initalData));
			dispatch(isEditDetailsStart(!isEdit));
		}
	}

	// onAuthCallBack Function
	function onAuthCallBack() {
		if (authData) {
			const { EconomicActivityID, EconomicActivityName } = authData;
			const data = {
				companyID,
				economicActivityID: EconomicActivityID,
				economicActivityName: EconomicActivityName,
				databaseName,
				userAccessBranchID,
				userID,
				userName,
			};
			dispatch(deleteEconomicActivityDetailsStart(data));
			setAuthData(null);
		}
	}

	// callOnEnter Function
	function callOnEnter(e: any) {
		if (e.key === 'Enter') {
			if (inputSearch !== null && inputSearch !== undefined) {
				initalData.inputSearch = inputSearch;
				isShowSpinner(true);
				dispatch(getEconomicActivityListStart(initalData));
			}
		}
	}
	return (
		<PageWrapper title='Economic Activity'>
			<SubHeader className='mt-3'>
				<SubHeaderLeft>
					<CardLabel icon='LocalActivity' iconColor='primary'>
						<div className='fw-bold fs-5 mb-0 headColor'>Economic Activity</div>
					</CardLabel>
				</SubHeaderLeft>
				{isShowAdd && (
					<SubHeaderRight>
						<Button
							color='primary'
							isLight
							icon='Add'
							onClick={() => {
								openEdit();
								setIsNew(true);
							}}>
							Add Economic Activity
						</Button>
					</SubHeaderRight>
				)}
			</SubHeader>

			<Page container='fluid'>
				<Card stretch>
					<CardHeader className='card-header-c'>
						<CardLabel>
							<Badge color='dark'>
								<div className='h6 mb-0'>Economic Activity # : {totalCount}</div>
							</Badge>
						</CardLabel>
						<CardActions>
							<div className='d-flex searchBox' data-tour='search'>
								<label
									className='border-0 bg-transparent cursor-pointer'
									htmlFor='searchInput'>
									<Icon icon='Search' size='2x' color='primary' />
								</label>
								<Input
									id='searchInput'
									type='search'
									className='border-0 shadow-none bg-transparent'
									placeholder='Search...'
									onChange={(e: any) => serSearchValueSet(e.target.value)}
									onKeyDown={callOnEnter}
									value={inputSearch}
									autoComplete='off'
								/>
							</div>
						</CardActions>
					</CardHeader>
					<CardBody className='table-responsive' isScrollable>
						<table className='table table-modern'>
							<thead>
								<tr>
									<th>Economic Activity Name</th>
									<th>Economic Activity Type</th>
									<th>{isShowEdit ? 'Edit' : 'View'}</th>
									{isShowDelete && <th>Remove</th>}
								</tr>
							</thead>
							<tbody>
								{isSpinner ? <TableSpinner /> : ''}
								{!isSpinner && economicActivityListArr.length > 0 ? (
									economicActivityListArr.map((item: any) => (
										<CommonTable
											key={item.EconomicActivityID}
											col1={item.EconomicActivityName}
											col2={item.EconomicActivityType}
											{...(isShowEdit
												? {
														editAction: () => {
															handleEdit(item.EconomicActivityID);
														},
													}
												: {
														viewAction: () => {
															handleEdit(item.EconomicActivityID);
														},
													})}
											{...(isShowDelete && {
												deleteAction: () => {
													handleDelete(item);
												},
											})}
										/>
									))
								) : !isSpinner ? (
									<tr>
										<td>EconomicActivity Not Found</td>
									</tr>
								) : (
									''
								)}
							</tbody>
						</table>
					</CardBody>
					<CardFooter>
						<Pagination
							data={economicActivityListArr}
							label='items'
							setCurrentPage={setCurrentPage}
							currentPage={currentPage}
							perPage={perPage}
							// @ts-ignore
							setPerPage={setPerPage}
							totalItem={totalCount}
						/>
					</CardFooter>
				</Card>
			</Page>

			<OffCanvas isOpen={isEdit} tag='form' noValidate>
				<OffCanvasHeader setOpen={openEdit}>
					<OffCanvasTitle id='edit-panel'>
						Economic Activity{' '}
						{!isNew ? (
							<Badge color='secondary' isLight>
								Edit
							</Badge>
						) : (
							<Badge color='primary' isLight>
								New
							</Badge>
						)}
					</OffCanvasTitle>
				</OffCanvasHeader>

				<OffCanvasBody>
					<div className='row h-100 pb-3'>
						<div className='col-lg-12 col-md-12'>
							<Card stretch tag='form' noValidate>
								<CardBody className='pb-0 card-body-padd' isScrollable>
									<AddEconomicActivityComponent isNewForm={isNew} />
								</CardBody>
							</Card>
						</div>
					</div>
				</OffCanvasBody>
			</OffCanvas>
			<CommonAuthenticationModal
				setAuthModal={setAuthModal}
				authModal={authModal}
				callBack={onAuthCallBack}
				setAuthData={setAuthData}
			/>
		</PageWrapper>
	);
};

export default EconomicActivityComponent;
