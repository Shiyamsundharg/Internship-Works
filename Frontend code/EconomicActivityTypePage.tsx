// Version : 0.0.2
// Author : VISHNU
// LastEdit : SHIYAM
// Last ADD : Changed Swalcomponent of rollback to showNotification and changed notification messages
// MODFIED DATE : 11-08-2025

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
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
import Pagination from '../../_common/Pagination';
import CommonTable from '../../_common/table/TableComponent';
import TableSpinner from '../../_common/table/TableSpinner';
import showAlert from '../../_common/SwalAlert';
import AddEconomicActivityTypeComponent from './add-economic-activity-type/AddEconomicActivityTypeComponent';
import { isEditDetailsStart } from '../../../redux/general/general.action';
import {
	getEconomicActivityTypeListStart,
	getEconomicActivityTypeListResponseResetStart,
	fetchEconomicActivityTypeDetailsStart,
	deleteEconomicActivityTypeDetailsStart,
	deleteEconomicActivityTypeDetailsResponseResetStart,
} from '../../../redux/master/economic-activity-type/economic-activity-type.action';
import { getLoginObjDetails } from '../../../redux/login/login.selector';
import { selectEditDetails } from '../../../redux/general/general.selector';
import {
	selectEconomicActivityTypeListGetResponse,
	selectEconomicActivityTypeListData,
	selectDeleteEconomicActivityTypeResponse,
} from '../../../redux/master/economic-activity-type/economic-activity-type.selector';
import '../../../styles/common/_common.scss';
import generalLoadUserControl from '../../../common/function/generalLoadUserControl';
import CommonAuthenticationModal from '../../_common/CommonAuthenticationModal';
import showNotification from '../../../components/extras/showNotification';

const EconomicActivityTypeComponent = () => {
	const dispatch = useDispatch();
	const loginData = useSelector(getLoginObjDetails);
	const [inputSearch, serSearchValueSet] = useState('');
	const isEdit = useSelector(selectEditDetails);
	const [authModal, setAuthModal] = useState(false);
	const [authData, setAuthData] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [pevPage, setPevPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['20']);
	const [isSpinner, isShowSpinner] = useState(false);
	const [isNew, setIsNew] = useState(false);

	/****** GET ECONOMIC ACTIVITY TYPE LIST  **********/
	const economicActivityTypeListResp = useSelector(selectEconomicActivityTypeListGetResponse);
	const economicActivityTypeListArr = useSelector(selectEconomicActivityTypeListData);

	/****** DELETE ECONOMIC ACTIVITY TYPE DETAILS **********/
	const economicActivityTypeDeleteResp = useSelector(selectDeleteEconomicActivityTypeResponse);
	const [economicActivityTypeDetails, setEconomicActivityTypeDetails] = useState({
		totalCount: 0,
		EconomicActivityTypeID: '',
		EconomicActivityTypeName: '',
		fetchEconomicActivityTypeListArr: [],
	});
	const { totalCount } = economicActivityTypeDetails;
	const {
		companyID,
		userID,
		userName,
		userAccessBranchID,
		databaseName,
		isAuthenticationNeeded,
	} = loginData;

	const usercontrolaccess = generalLoadUserControl('Master', 'EconomicActivityType', loginData);
	const { isShowAdd, isShowEdit, isShowDelete } = usercontrolaccess;

	const initalData = {
		companyID,
		limit: 0,
		databaseName,
		inputSearch,
	};

	// On Load EconomicActivityType List
	function onLoanEconomicActivityTypeList() {
		serSearchValueSet('');
		dispatch(getEconomicActivityTypeListStart(initalData));
	}

	// INITIAL API CALL
	useEffect(() => {
		isShowSpinner(true);
		onLoanEconomicActivityTypeList();
	}, []);

	// HANDLE RESPONSE IN USEEFFECT
	useEffect(() => {
		// Economic Activity Type List Response
		if (economicActivityTypeListResp !== null && economicActivityTypeListResp !== undefined) {
			if (economicActivityTypeListResp.statusCode === '01') {
				const { totalEconomicActivityTypeCount } = economicActivityTypeListResp;
				setEconomicActivityTypeDetails({
					...economicActivityTypeDetails,
					totalCount: Number(totalEconomicActivityTypeCount),
					fetchEconomicActivityTypeListArr: economicActivityTypeListArr,
				});
			} else if (economicActivityTypeListResp.statusCode === '102') {
				const { totalEconomicActivityTypeCount } = economicActivityTypeListResp;
				setEconomicActivityTypeDetails({
					...economicActivityTypeDetails,
					totalCount: Number(totalEconomicActivityTypeCount),
					fetchEconomicActivityTypeListArr: [],
				});
			} else if (economicActivityTypeListResp.statusCode === '100') {
				swalComponent('Aborted!', 'Let’s give it another go', 'danger');
			} else if (economicActivityTypeListResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			isShowSpinner(false);
			dispatch(getEconomicActivityTypeListResponseResetStart());
		}

		// Economic Activity Type Delete Response
		if (
			economicActivityTypeDeleteResp !== null &&
			economicActivityTypeDeleteResp !== undefined
		) {
			if (economicActivityTypeDeleteResp.statusCode === '01') {
				isShowSpinner(true);
				swalComponent(
					'You’re Good to Go!',
					'Economic Activity Type Deleted Successfully',
					'success',
				);
				onLoanEconomicActivityTypeList();
			} else if (economicActivityTypeDeleteResp.statusCode === '100') {
				swalComponent('Aborted!', 'Let’s give it another go', 'danger');
			} else if (economicActivityTypeDeleteResp.statusCode === '103') {
				swalComponent(
					'Aborted!',
					'Economic Activity Type is used in Economic Actvity',
					'warning',
				);
			} else if (economicActivityTypeDeleteResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			dispatch(deleteEconomicActivityTypeDetailsResponseResetStart());
		}

		if (pevPage !== currentPage) {
			setPevPage(currentPage);
			const limitCount = currentPage * 20 - 20;
			initalData.limit = limitCount;
			onLoanEconomicActivityTypeList();
		}
	}, [economicActivityTypeListResp, economicActivityTypeDeleteResp, currentPage, inputSearch]);

	// Handle Edit Function
	function handleEdit(economicActivityTypeID: any) {
		const data = {
			companyID,
			economicActivityTypeID,
			databaseName,
		};
		dispatch(fetchEconomicActivityTypeDetailsStart(data));
		openEdit();
		setIsNew(false);
	}

	// Handle Delete Function
	function handleDelete(item: any) {
		const { EconomicActivityTypeID, EconomicActivityTypeName } = item;
		showAlert({
			title: 'Are you sure?',
			text: 'Once deleted, you will not be able to recover this Economic Activity Type!',
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
						economicActivityTypeID: EconomicActivityTypeID,
						economicActivityTypeName: EconomicActivityTypeName,
						databaseName,
						userAccessBranchID,
						userID,
						userName,
					};
					dispatch(deleteEconomicActivityTypeDetailsStart(data));
				}
			}
		});
	}

	// onAuthCallBack Function
	function onAuthCallBack() {
		const { EconomicActivityTypeID, EconomicActivityTypeName } = economicActivityTypeDetails;
		if (authData) {
			const data = {
				companyID,
				economicActivityTypeID: EconomicActivityTypeID,
				economicActivityTypeName: EconomicActivityTypeName,
				databaseName,
				userAccessBranchID,
				userID,
				userName,
			};
			dispatch(deleteEconomicActivityTypeDetailsStart(data));
			setAuthData('');
		}
	}

	// callOnEnter Function
	function callOnEnter(e: any) {
		if (e.key === 'Enter') {
			if (inputSearch !== null && inputSearch !== undefined && inputSearch !== '0') {
				initalData.inputSearch = inputSearch;
				isShowSpinner(true);
				setEconomicActivityTypeDetails({
					...economicActivityTypeDetails,
					fetchEconomicActivityTypeListArr: [],
				});
				dispatch(getEconomicActivityTypeListStart(initalData));
			}
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
						onLoanEconomicActivityTypeList();
					}
				}
			});
		} else {
			dispatch(isEditDetailsStart(!isEdit));
		}
	}

	// Swal Component Function
	function swalComponent(title: string, text: string, icon: any) {
		showAlert({ title, text, icon });
	}
	return (
		<PageWrapper title='Economic Activity Type'>
			<SubHeader className='mt-3'>
				<SubHeaderLeft>
					<CardLabel icon='VolunteerActivism' iconColor='primary'>
						<div className='fw-bold fs-5 mb-0 headColor'>Economic Activity Type</div>
					</CardLabel>
				</SubHeaderLeft>
				{isShowAdd && (
					<SubHeaderRight>
						<Button
							color='dark'
							isLight
							icon='Add'
							onClick={() => {
								openEdit();
								setIsNew(true);
							}}>
							Add Economic Activity Type
						</Button>
					</SubHeaderRight>
				)}
			</SubHeader>
			<Page container='fluid'>
				<Card stretch>
					<CardHeader className='card-header-c'>
						<Badge color='dark'>
							<div className='h6 mb-0'>
								Economic Activity Type # : {totalCount ?? '0'}
							</div>
						</Badge>
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
									<th>Economic Activity Type</th>
									<th>{isShowEdit ? 'Edit' : 'View'}</th>
									{isShowDelete && <th>Remove</th>}
								</tr>
							</thead>
							<tbody>
								{isSpinner ? <TableSpinner /> : ''}
								{economicActivityTypeDetails.fetchEconomicActivityTypeListArr
									?.length > 0 ? (
									economicActivityTypeDetails.fetchEconomicActivityTypeListArr.map(
										(item: any) => (
											<CommonTable
												key={item.EconomicActivityTypeID}
												col1={item.EconomicActivityTypeName}
												{...(isShowEdit
													? {
															editAction: () => {
																handleEdit(
																	item.EconomicActivityTypeID,
																);
															},
														}
													: {
															viewAction: () => {
																handleEdit(
																	item.EconomicActivityTypeID,
																);
															},
														})}
												{...(isShowDelete && {
													deleteAction: () => {
														handleDelete(item);
													},
												})}
											/>
										),
									)
								) : !isSpinner ? (
									<tr>
										<td>Economic Activity Type Not Found</td>
									</tr>
								) : (
									''
								)}
							</tbody>
						</table>
					</CardBody>
					<CardFooter>
						<Pagination
							data={economicActivityTypeListArr}
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
						{!isNew ? 'Edit Economic Activity Type' : 'New Economic Activity Type'}{' '}
						{!isNew ? (
							<Badge color='primary' isLight>
								Edit
							</Badge>
						) : (
							<Badge color='success' isLight>
								New
							</Badge>
						)}
					</OffCanvasTitle>
				</OffCanvasHeader>

				<OffCanvasBody>
					<div className='row h-100 pb-3'>
						<div className='col-lg-12 col-md-12'>
							<Card stretch tag='form' noValidate>
								<CardBody className='pb-0' isScrollable>
									<AddEconomicActivityTypeComponent isNewForm={isNew} />
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

export default EconomicActivityTypeComponent;
