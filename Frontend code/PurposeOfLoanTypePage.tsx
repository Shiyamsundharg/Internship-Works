// Version : 0.0.5
// LastEdit : Shiyam
// LastAdd  : REMOVED THE TABLESTYLE CLASSNAME
// MODFIED DATA : 09-10-2025
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditDetails } from '../../../redux/general/general.selector';
import { PER_COUNT } from '../../../components/PaginationButtons';
import { getLoginObjDetails } from '../../../redux/login/login.selector';

import {
	getPurposeOfLoanTypeStart,
	getPurposeOfLoanTypeResponseReset,
	deletePurposeOfLoanTypeStart,
	deletePurposeOfLoanTypeResponseReset,
	fetchPurposeOfLoanTypeDetailsStart,
} from '../../../redux/master/purpose-of-loan-type/purpose-of-loan-type.action';

import {
	selectPurposeOfLoanTypeResponseData,
	selectPurposeOfLoanTypeResponse,
	selectDeletePurposeOfLoanTypeResponse,
} from '../../../redux/master/purpose-of-loan-type/purpose-of-loan-type.selector';
import { isEditDetailsStart } from '../../../redux/general/general.action';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import CommonTable from '../../_common/table/TableComponent';
import CommonPagination from '../../_common/Pagination';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import Badge from '../../../components/bootstrap/Badge';
import CommonAuthenticationModal from '../../_common/CommonAuthenticationModal';
import Icon from '../../../components/icon/Icon';
import AddPurposeofLoanTypeComponent from './add-purpose-of-loan-type/AddPurposeOfLoanTypeComponent';
import Input from '../../../components/bootstrap/forms/Input';
import TableSpinner from '../../_common/table/TableSpinner';
import showAlert from '../../_common/SwalAlert';
import generalLoadUserControl from '../../../common/function/generalLoadUserControl';
import '../../../styles/common/_common.scss';
import showNotification from '../../../components/extras/showNotification';

const PurposeofLoanTypeComponent = () => {
	const dispatch = useDispatch();

	/********** LOGIN DATA SELECTOR *********/
	const loginData = useSelector(getLoginObjDetails);

	/********** USE STATE FOR SEARCH VALUE SET *********/
	const [searchValueSet, serSearchValueSet] = useState('');

	/********** PURPOSE OF LOAN TYPE LIST RESP *********/
	const purposeOfLoanTypeListResp = useSelector(selectPurposeOfLoanTypeResponse);

	/********** USE SELECTOR FOR PURPOSE OF LOAN TYPE LIST ARR *********/
	const purposeOfLoanTypeListArr = useSelector(selectPurposeOfLoanTypeResponseData);

	/********** USE SELECTOR FOR PURPOSE OF DELETE RESPONSE *********/
	const purposeOfLoanTypeDeleteResp = useSelector(selectDeletePurposeOfLoanTypeResponse);

	/********** USE SELECTOR FOR ISEDIT *********/
	const isEdit = useSelector(selectEditDetails);

	/********** USE STATE FOR AUTHMODAL *********/
	const [authModal, setAuthModal] = useState(false);

	/********** USE STATE FOR AUTHDATA *********/
	const [authData, setAuthData] = useState<typeof purposeofloanTypeDetails | null>(null);

	/********** USE STATE FOR TRACKING CURRENT PAGE *********/
	const [currentPage, setCurrentPage] = useState(1);

	/********** USE STATE FOR TRACKING PREVIOUS PAGE *********/
	const [pevPage, setPevPage] = useState(1);

	/********** USE STATE FOR TRACKING PER PAGE *********/
	const [perPage, setPerPage] = useState(PER_COUNT['20']);

	/********** USE STATE FOR ISSPINNER *********/
	const [isSpinner, isShowSpinner] = useState(false);

	/********** USE STATE FOR ISNEW *********/
	const [isNew, setIsNew] = useState(false);

	const [totalLoanTypeCount, setTotalLoanTypeCount] = useState(0);

	/****** USE STATE FOR PURPOSE OF LOAN TYPE DETAILS **********/
	const [purposeofloanTypeDetails, setPurposeOfLoanTypeDetails] = useState({
		totalCount: 0,
		PurposeOfLoanTypeID: '',
		PurposeOfLoanTypeName: '',
	});
	const { totalCount } = purposeofloanTypeDetails;

	/********** LOGIN DATA *********/
	const {
		companyID,
		userID,
		userName,
		userAccessBranchID,
		databaseName,
		isAuthenticationNeeded,
	} = loginData;

	/********** USERCONTROLLACCESS FOR PURPOSE OF LOAN TYPE *********/
	const usercontrolaccess = generalLoadUserControl('Master', 'Purpose Of Loan Type', loginData);
	const { isShowAdd, isShowEdit, isShowDelete } = usercontrolaccess;

	/********** ASSIGN INITIAL DATA *********/
	const initalData = {
		companyID,
		limit: 0,
		inputSearch: '',
		databaseName,
	};

	/********** NOTIFICATION FUNCTION *********/
	function swalComponent(title: string, text: string, icon: any) {
		showAlert({ title, text, icon });
	}

	/********** DISPATCH FUNCTION *********/
	function getPurposeofLoanList() {
		serSearchValueSet('');
		dispatch(getPurposeOfLoanTypeStart(initalData));
	}

	/********** DISPATCH FOR PURPOSE OF LOAN LIST *********/
	useEffect(() => {
		isShowSpinner(true);
		getPurposeofLoanList();
	}, []);

	useEffect(() => {
		/********** PURPOSE OF LOAN LIST RESPONSE HANDLING *********/
		if (purposeOfLoanTypeListResp !== null && purposeOfLoanTypeListResp !== undefined) {
			const { statusCode, totalCount } = purposeOfLoanTypeListResp;
			if (statusCode === '01') {
				setTotalLoanTypeCount(totalCount);
			} else if (statusCode === '102') {
				swalComponent('Aborted!', 'Purpose Of Loan Type Not Found', 'warning');
			}
			if (statusCode === '100') {
				swalComponent('Aborted!', 'Lets give it another go', 'danger');
			} else if (statusCode === '102') {
				swalComponent('Aborted!', 'Purpose Of Loan Type Not Found', 'warning');
			} else if (statusCode === '111') {
				showNotification(
					'Aborted!',
					"Your request couldn't be processed at the moment",
					'danger',
				);
			}
			setPurposeOfLoanTypeDetails({
				...purposeofloanTypeDetails,
				totalCount,
			});
			isShowSpinner(false);
			dispatch(getPurposeOfLoanTypeResponseReset());
		}

		// HANDLE PUPOSE OF LOAN DELETE RESPONSE
		if (purposeOfLoanTypeDeleteResp !== null && purposeOfLoanTypeDeleteResp !== undefined) {
			const { statusCode } = purposeOfLoanTypeDeleteResp;
			if (statusCode === '01') {
				isShowSpinner(false);
				swalComponent(
					"You're Good To Go",
					'Purpose Of Loan Details Deleted Successfully',
					'success',
				);
			} else if (statusCode === '111') {
				showNotification(
					'Aborted!',
					"Your request couldn't be processed at the moment",
					'danger',
				);
			} else {
				swalComponent('Aborted!', 'Purpose Of Loan Details Deleted failed', 'danger');
			}
			getPurposeofLoanList();
			dispatch(deletePurposeOfLoanTypeResponseReset());
		}

		// PAGINATION
		if (pevPage !== currentPage) {
			setPevPage(currentPage);
			const limitCount = currentPage * 20 - 20;
			initalData.limit = limitCount;
			getPurposeofLoanList();
		}
	}, [purposeOfLoanTypeListResp, purposeOfLoanTypeDeleteResp, currentPage]);

	// EDIT FUNCTION
	function handleEdit(purposeOfLoanTypeID: any) {
		const data = {
			companyID,
			purposeOfLoanTypeID,
			databaseName,
		};
		dispatch(fetchPurposeOfLoanTypeDetailsStart(data));
		openEdit();
		setIsNew(false);
	}

	// DELETE FUNCTION
	function handleDelete(item: any) {
		if (item.TotalActiveCount > 0) {
			swalComponent('Aborted!', 'Purpose Of Loan already mapped on this Type', 'error');
		} else {
			showAlert({
				title: 'Are you sure?',
				text: 'Once deleted, you will not be able to recover this Purpose of loan!',
				icon: 'warning',
				confirmButtonText: 'Yes!',
				showCancelButton: true,
			}).then((result) => {
				if (result.isConfirmed) {
					if (isAuthenticationNeeded === '1') {
						setAuthData(item);
						setAuthModal(true);
					} else {
						const { PurposeOfLoanTypeID, PurposeOfLoanTypeName } = item;
						const data = {
							companyID,
							PurposeOfLoanTypeID: PurposeOfLoanTypeID,
							PurposeOfLoanTypeName: PurposeOfLoanTypeName,
							databaseName,
							userAccessBranchID,
							userID,
							userName,
						};
						dispatch(deletePurposeOfLoanTypeStart(data));
						setPurposeOfLoanTypeDetails({
							...purposeofloanTypeDetails,
							PurposeOfLoanTypeID: PurposeOfLoanTypeID,
							PurposeOfLoanTypeName: PurposeOfLoanTypeName,
						});
					}
				}
			});
		}
	}

	// AUTH DELETE FUNCTION IF AUTENTICATION NEEDED
	function onAuthCallBack() {
		if (authData) {
			const { PurposeOfLoanTypeID, PurposeOfLoanTypeName } = authData;
			const data = {
				companyID,
				PurposeOfLoanTypeID: PurposeOfLoanTypeID,
				PurposeOfLoanTypeName: PurposeOfLoanTypeName,
				databaseName,
				userAccessBranchID,
				userID,
				userName,
			};
			dispatch(deletePurposeOfLoanTypeStart(data));
			setPurposeOfLoanTypeDetails({
				...purposeofloanTypeDetails,
				PurposeOfLoanTypeID: PurposeOfLoanTypeID,
				PurposeOfLoanTypeName: PurposeOfLoanTypeName,
			});
			setAuthData(null);
		}
	}

	// SEARCH FUNCTION
	function callOnEnter(e: any) {
		if (e.key === 'Enter') {
			if (searchValueSet !== null && searchValueSet !== undefined) {
				initalData.inputSearch = searchValueSet;
				isShowSpinner(true);
				dispatch(getPurposeOfLoanTypeStart(initalData));
			}
		}
	}

	// EDIT FUNCTION
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
					if (searchValueSet != '') {
						getPurposeofLoanList();
					}
				}
			});
		} else {
			dispatch(isEditDetailsStart(!isEdit));
		}
	}

	return (
		<PageWrapper title='Purpose Of Loan Type'>
			<SubHeader className='mt-3'>
				<SubHeaderLeft>
					<CardLabel icon='LocalActivity' iconColor='primary'>
						<div className='fw-bold fs-5 mb-0 headColor'>Purpose Of Loan Type</div>
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
							Add Purpose of Loan Type
						</Button>
					</SubHeaderRight>
				)}
			</SubHeader>
			<Page container='fluid'>
				<Card stretch>
					<CardHeader className='card-header-c'>
						<CardLabel>
							<Badge color='dark'>
								<div className='h6 mb-0'>
									Purpose of Loan Type # : {totalCount ?? '0'}
								</div>
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
									value={searchValueSet}
									autoComplete='off'
								/>
							</div>
						</CardActions>
					</CardHeader>
					<CardBody className='table-responsive' isScrollable>
						<table className='table table-modern'>
							<thead>
								<tr>
									<th>Purpose of Loan Type Name</th>
									<th>{isShowEdit ? 'Edit' : 'View'}</th>
									{isShowDelete && <th>Remove</th>}
								</tr>
							</thead>
							<tbody>
								{isSpinner ? <TableSpinner /> : ''}
								{purposeOfLoanTypeListArr.length > 0 ? (
									purposeOfLoanTypeListArr.map((item: any) => (
										<CommonTable
											key={item.PurposeOfLoanTypeID}
											col1={item.PurposeOfLoanTypeName ?? '-'}
											{...(isShowEdit
												? {
														editAction: () => {
															handleEdit(item.PurposeOfLoanTypeID);
														},
													}
												: {
														viewAction: () => {
															handleEdit(item.PurposeOfLoanTypeID);
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
										<td>Purpose Of Loan Type Not Found</td>
									</tr>
								) : (
									''
								)}
							</tbody>
						</table>
					</CardBody>
					<CardFooter>
						<CommonPagination
							data={purposeOfLoanTypeListArr}
							label='items'
							setCurrentPage={setCurrentPage}
							currentPage={currentPage}
							perPage={perPage}
							// @ts-ignore
							setPerPage={setPerPage}
							totalItem={totalLoanTypeCount}
						/>
					</CardFooter>
				</Card>
			</Page>

			<OffCanvas isOpen={isEdit} tag='form' noValidate>
				<OffCanvasHeader setOpen={openEdit}>
					<OffCanvasTitle id='edit-panel'>
						Purpose Of Loan{' '}
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
								<CardBody className='pb-0' isScrollable>
									<AddPurposeofLoanTypeComponent isNewForm={isNew} />
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

export default PurposeofLoanTypeComponent;
