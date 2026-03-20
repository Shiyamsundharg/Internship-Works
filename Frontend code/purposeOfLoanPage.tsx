// Version : 0.0.3
// Author : AGALYA
// LastEdit : SHIYAM
// Last ADD : changed single line const function for payload in all function, added command lines for const's and changed response messages
// MODFIED DATE : 07-08-2025

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectDeletePurposeOfLoanResponse,
	selectPurposeOfLoanListData,
	selectPurposeOfLoanListGetResponse,
	selectUpdatePurposeOfLoanPublishStatus,
} from '../../../redux/master/purpose-of-loan/purpose-of-loan.selector';
import { selectEditDetails } from '../../../redux/general/general.selector';
import { PER_COUNT } from '../../../components/PaginationButtons';
import { getLoginObjDetails } from '../../../redux/login/login.selector';
import {
	deletePurposeOfLoanDetailsResponseResetStart,
	deletePurposeOfLoanDetailsStart,
	fetchPurposeOfLoanDetailsStart,
	getPurposeOfLoanListResponseResetStart,
	getPurposeOfLoanListStart,
	updatePurposeOfLoanPublishStatusResponseResetStart,
	updatePurposeOfLoanPublishStatusStart,
} from '../../../redux/master/purpose-of-loan/purpose-of-loan.action';
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
import AddPurposeofLoanComponent from './add-purpose-of-loan/AddPurposeOfLoanComponent';
import Input from '../../../components/bootstrap/forms/Input';
import TableSpinner from '../../_common/table/TableSpinner';
import showAlert from '../../_common/SwalAlert';
import generalLoadUserControl from '../../../common/function/generalLoadUserControl';
import '../../../styles/common/_common.scss';
import showNotification from '../../../components/extras/showNotification';

const PurposeofLoanComponent = () => {
	const dispatch = useDispatch();

	/****** LOGIN DATA **********/
	const loginData = useSelector(getLoginObjDetails);

	/****** FETCH ECONOMIC ACTIVITY LIST  **********/
	const purposeOfLoanListResp = useSelector(selectPurposeOfLoanListGetResponse);
	const purposeOfLoanListArr = useSelector(selectPurposeOfLoanListData);

	/****** DELETE ECONOMIC ACTIVITY  **********/
	const purposeOfLoanDeleteResp = useSelector(selectDeletePurposeOfLoanResponse);

	/****** UPDATE ECONOMIC ACTIVITY  **********/
	const updatePurposeOfLoanPublishStatus = useSelector(selectUpdatePurposeOfLoanPublishStatus);
	const isEdit = useSelector(selectEditDetails);

	// SEARCH VALUE STATE
	const [searchValueSet, serSearchValueSet] = useState('');

	// AUTHMODAL STATE
	const [authModal, setAuthModal] = useState(false);

	// AUTHDATA STATE
	const [authData, setAuthData] = useState<typeof purposeofloanDetails | null>(null);

	// CURRENT STATE
	const [currentPage, setCurrentPage] = useState(1);

	// PEV PAGE STATE
	const [pevPage, setPevPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['20']);

	// IS SPINNER STATE
	const [isSpinner, isShowSpinner] = useState(false);

	// IS NEW STATE
	const [isNew, setIsNew] = useState(false);

	// PURPOSE OF LOAN DETAILS STATE
	const [purposeofloanDetails, setPurposeOfLoanDetails] = useState({
		totalCount: 0,
		PurposeOfLoanID: '',
		PurposeOfLoanName: '',
	});
	const { totalCount } = purposeofloanDetails;
	const {
		companyID,
		userID,
		userName,
		userAccessBranchID,
		databaseName,
		isAuthenticationNeeded,
	} = loginData;

	const usercontrolaccess = generalLoadUserControl('Master', 'Purpose Of Loan', loginData);
	const { isShowAdd, isShowEdit, isShowDelete } = usercontrolaccess;

	const initalData = {
		companyID,
		limit: 0,
		inputSearch: '',
		databaseName,
	};

	// NOTIFICATION FUNCTION
	function swalComponent(title: string, text: string, icon: any) {
		showAlert({ title, text, icon });
	}

	// DISPATCH FUNCTION
	function getPurposeofLoanList() {
		serSearchValueSet('');
		dispatch(getPurposeOfLoanListStart(initalData));
	}
	// DISPATCH FOR PURPOSE OF LOAN LIST
	useEffect(() => {
		isShowSpinner(true);
		getPurposeofLoanList();
	}, []);

	useEffect(() => {
		// PURPOSE OF LOAN LIST RESPONSE HANDLING
		if (purposeOfLoanListResp !== null && purposeOfLoanListResp !== undefined) {
			const { totalPurposeOfLoanCount, statusCode } = purposeOfLoanListResp;
			if (statusCode === '100') {
				swalComponent('Aborted!', 'let’s give it another go', 'danger');
			} else if (purposeOfLoanListResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			setPurposeOfLoanDetails({
				...purposeofloanDetails,
				totalCount: Number(totalPurposeOfLoanCount),
			});
			isShowSpinner(false);
			dispatch(getPurposeOfLoanListResponseResetStart());
		}
		// HANDLE PURPOSE OF LOAN DELETE RESPONSE
		if (purposeOfLoanDeleteResp !== null && purposeOfLoanDeleteResp !== undefined) {
			const { statusCode } = purposeOfLoanDeleteResp;
			if (statusCode === '01') {
				isShowSpinner(false);
				swalComponent(
					'You’re Good to Go!',
					'Purpose Of Loan Details Deleted Successfully',
					'success',
				);
			} else if (statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			} else if (statusCode === '102') {
				showNotification('Aborted!', 'Purpose Of Loan Details Already in Use', 'danger');
			} else {
				swalComponent('Aborted!', 'Purpose Of Loan Details Deleted failed', 'danger');
			}
			getPurposeofLoanList();
			dispatch(deletePurposeOfLoanDetailsResponseResetStart());
		}
		// HANDLE UPDATE PURPOSE OF LOAN PUBLISH STATUS
		if (updatePurposeOfLoanPublishStatus !== null) {
			const { statusCode } = updatePurposeOfLoanPublishStatus;
			if (statusCode === '01') {
				isShowSpinner(false);
				swalComponent(
					'You’re Good to Go!',
					'Purpose of Loan publish status updated successfully.',
					'success',
				);
			} else if (statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			} else {
				swalComponent(
					'Aborted!',
					'Purpose of Loan publish status updated failed',
					'danger',
				);
			}
			getPurposeofLoanList();
			dispatch(updatePurposeOfLoanPublishStatusResponseResetStart());
		}
		// PAGINATION
		if (pevPage !== currentPage) {
			setPevPage(currentPage);
			const limitCount = currentPage * 20 - 20;
			initalData.limit = limitCount;
			dispatch(getPurposeOfLoanListStart(initalData));
		}
	}, [
		purposeOfLoanListResp,
		purposeOfLoanDeleteResp,
		updatePurposeOfLoanPublishStatus,
		currentPage,
	]);

	// EDIT FUNCTION
	function handleEdit(purposeOfLoanID: any) {
		const data = {
			companyID,
			purposeOfLoanID,
			databaseName,
		};
		dispatch(fetchPurposeOfLoanDetailsStart(data));
		openEdit();
		setIsNew(false);
	}

	// DELETE FUNCTION
	function handleDelete(item: any) {
		const { PurposeOfLoanID, PurposeOfLoanName, PurposeOfLoanTypeIDExist } = item;
		if (PurposeOfLoanTypeIDExist == '1') {
			swalComponent('Aborted!', 'Purpose of Loan already exist in loan index', 'danger');
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
						const data = {
							companyID,
							purposeOfLoanID: PurposeOfLoanID,
							purposeOfLoanName: PurposeOfLoanName,
							databaseName,
							userAccessBranchID,
							userID,
							userName,
						};
						dispatch(deletePurposeOfLoanDetailsStart(data));
						setPurposeOfLoanDetails({
							...purposeofloanDetails,
							PurposeOfLoanID: PurposeOfLoanID,
							PurposeOfLoanName: PurposeOfLoanName,
						});
					}
				}
			});
		}
	}

	// AUTH DELETE FUNCTION IF AUTENTICATION NEEDED
	function onAuthCallBack() {
		if (authData) {
			const { PurposeOfLoanID, PurposeOfLoanName } = authData;
			const data = {
				companyID,
				purposeOfLoanID: PurposeOfLoanID,
				purposeOfLoanName: PurposeOfLoanName,
				databaseName,
				userAccessBranchID,
				userID,
				userName,
			};
			dispatch(deletePurposeOfLoanDetailsStart(data));
			setPurposeOfLoanDetails({
				...purposeofloanDetails,
				PurposeOfLoanID: PurposeOfLoanID,
				PurposeOfLoanName: PurposeOfLoanName,
			});
			setAuthData(null);
		}
	}

	// PUBLISH PURPOSE OF LOAN FUNCTION
	function handleIsPublish(e: any, item: any) {
		const isChecked = e.currentTarget.checked;
		const actionText = isChecked ? 'Publish' : 'UnPublish';
		item.PurposeOfLoanPublishStatus = isChecked;
		item.IsPublish = isChecked ? 1 : 0;
		const { PurposeOfLoanID, PurposeOfLoanName } = item;
		showAlert({
			title: 'Are you sure?',
			text: `Do you want to ${actionText} this Purpose Of Loan`,
			icon: 'warning',
			confirmButtonText: 'Yes!',
			showCancelButton: true,
		}).then((result) => {
			if (result.isConfirmed) {
				const data = {
					companyID,
					isPublish: isChecked ? 1 : 0,
					purposeOfLoanID: PurposeOfLoanID,
					purposeOfLoanName: PurposeOfLoanName,
					databaseName,
					userName,
					userAccessBranchID,
					userID,
				};
				isShowSpinner(true);
				dispatch(updatePurposeOfLoanPublishStatusStart(data));
			}
		});
	}

	// SEARCH FUNCTION
	function callOnEnter(e: any) {
		if (e.key === 'Enter') {
			if (searchValueSet !== null && searchValueSet !== undefined) {
				initalData.inputSearch = searchValueSet;
				isShowSpinner(true);
				dispatch(getPurposeOfLoanListStart(initalData));
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
		<PageWrapper title='Purpose Of Loan'>
			<SubHeader className='mt-3'>
				<SubHeaderLeft>
					<CardLabel icon='VolunteerActivism' iconColor='primary'>
						<div className='fw-bold fs-5 mb-0 headColor'>Purpose Of Loan</div>
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
							Add Purpose of Loan
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
									Purpose of Loan # : {totalCount ?? '0'}
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
									<th>Purpose of Loan Name</th>
									<th>Purpose of Loan Category</th>
									<th>{isShowEdit ? 'Edit' : 'View'}</th>
									{isShowDelete && <th>Remove</th>}
									{isShowEdit && <th>Publish</th>}
								</tr>
							</thead>
							<tbody>
								{isSpinner ? <TableSpinner /> : ''}
								{purposeOfLoanListArr && purposeOfLoanListArr.length > 0 ? (
									purposeOfLoanListArr.map((item: any) => (
										<CommonTable
											key={item.PurposeOfLoanID}
											col1={item.PurposeOfLoanName}
											col2={item.PurposeOfLoanType}
											{...(isShowEdit
												? {
														editAction: () => {
															handleEdit(item.PurposeOfLoanID);
														},
													}
												: {
														viewAction: () => {
															handleEdit(item.PurposeOfLoanID);
														},
													})}
											{...(isShowDelete && {
												deleteAction: () => {
													handleDelete(item);
												},
											})}
											isPublish={
												item.PurposeOfLoanPublishStatus === true ||
												item.PurposeOfLoanPublishStatus === 'true'
											}
											{...(isShowEdit && {
												publishAction: (e: any) => {
													handleIsPublish(e, item);
												},
											})}
										/>
									))
								) : !isSpinner ? (
									<tr>
										<td>Purpose Of Loan Not Found</td>
									</tr>
								) : (
									''
								)}
							</tbody>
						</table>
					</CardBody>
					<CardFooter>
						<CommonPagination
							data={purposeOfLoanListArr}
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
									<AddPurposeofLoanComponent isNewForm={isNew} />
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

export default PurposeofLoanComponent;
