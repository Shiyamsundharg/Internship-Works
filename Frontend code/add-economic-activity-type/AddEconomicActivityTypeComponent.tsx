// Version : 0.0.2
// Author : VISHNU
// LastEdit : SHIYAM
// Last ADD : Changed Swalcomponent of rollback to showNotification and changed notification messages
// MODFIED DATE : 11-08-2025

/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, forwardRef } from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Button from '../../../../components/bootstrap/Button';
import Input from '../../../../components/bootstrap/forms/Input';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import { CardLabel, CardTitle } from '../../../../components/bootstrap/Card';
import Spinner from '../../../../components/bootstrap/Spinner';
import ButtonSpinner from '../../../_common/ButtonSpinner';
import '../../../../styles/common/_common.scss';
import { isEditDetailsStart } from '../../../../redux/general/general.action';
import {
	addEconomicActivityTypeDetailsStart,
	addEconomicActivityTypeDetailsResponseResetStart,
	fetchEconomicActivityTypeDetailsResponseResetStart,
	updateEconomicActivityTypeDetailsStart,
	updateEconomicActivityTypeDetailsResponseResetStart,
	getEconomicActivityTypeListStart,
} from '../../../../redux/master/economic-activity-type/economic-activity-type.action';
import { getLoginObjDetails } from '../../../../redux/login/login.selector';
import {
	selectAddEconomicActivityType,
	selectFetchEconomicActivityTypeDetails,
	selectFetchEconomicActivityTypeData,
	selectUpdateEconomicActivityType,
} from '../../../../redux/master/economic-activity-type/economic-activity-type.selector';
import generalLoadUserControl from '../../../../common/function/generalLoadUserControl';
import CommonAuthenticationModal from '../../../_common/CommonAuthenticationModal';
import showAlert from '../../../_common/SwalAlert';
import validateEconomicActivityType from '../../../helper/master/economic-activity-type/economicActivityTypeValidate';
import showNotification from '../../../../components/extras/showNotification';

const EconomicActivityTypeAddComponent = forwardRef(({ isNewForm }: any) => {
	const dispatch = useDispatch();
	const loginData = useSelector(getLoginObjDetails);

	/****** ADD ECONOMIC ACTIVITY TYPE RESPONSE  **********/
	const addEconomicActivityTypeResp = useSelector(selectAddEconomicActivityType);

	/****** FETCH ECONOMIC ACTIVITY TYPE DETAILS RESPONSE  **********/
	const fetchEconomicActivityTypeDetailsResp = useSelector(
		selectFetchEconomicActivityTypeDetails,
	);
	const fetchEconomicActivityTypeDetailsArr = useSelector(selectFetchEconomicActivityTypeData);

	/****** UPDATE ECONOMIC ACTIVITY TYPE RESPONSE  **********/
	const economicActivityTypeUpdateResp = useSelector(selectUpdateEconomicActivityType);

	const {
		companyID,
		userID,
		userName,
		userAccessBranchID,
		databaseName,
		isAuthenticationNeeded,
	} = loginData;

	const Usercontrolaccess = generalLoadUserControl('Master', 'EconomicActivityType', loginData);
	const { isShowAdd, isShowEdit } = Usercontrolaccess;
	const [authModal, setAuthModal] = useState(false);
	const [isSpinner, setIsSpinner] = useState(false);

	// INITIAL FORMIK VALUES
	const formik = useFormik({
		initialValues: {
			economicActivityTypeID: '',
			economicActivityTypeName: '',
			companyID,
			userID,
			userName,
			userAccessBranchID,
			databaseName,
		},
		validate: validateEconomicActivityType,
		onSubmit: (values) => {
			if (isAuthenticationNeeded === '1') {
				setAuthModal(true);
			} else {
				setIsSpinner(true);
				if (isNewForm) {
					dispatch(addEconomicActivityTypeDetailsStart(values));
				} else {
					dispatch(updateEconomicActivityTypeDetailsStart(values));
				}
			}
		},
	});

	// HANDLE RESPONSE IN USEEFFCT
	useEffect(() => {
		// ADD ECONOMIC ACTIVITY TYPE RESPONSE
		if (addEconomicActivityTypeResp !== null && addEconomicActivityTypeResp !== undefined) {
			if (addEconomicActivityTypeResp.statusCode === '01') {
				swalComponent(
					'You’re Good to Go!',
					'Economic Activity Type Added Successfully',
					'success',
				);
				resetEconomicActivityTypePage();
			} else if (addEconomicActivityTypeResp.statusCode === '101') {
				dispatch(isEditDetailsStart(false));
				swalComponent('Aborted!', 'Economic Activity Type Already Exits', 'warning');
			} else if (addEconomicActivityTypeResp.statusCode === '100') {
				swalComponent('Aborted!', 'Let’s give it another go', 'danger');
			} else if (addEconomicActivityTypeResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			setIsSpinner(false);
			dispatch(addEconomicActivityTypeDetailsResponseResetStart());
		}
		// FETCH ECONOMIC ACTIVITY TYPE DETAILS RESPONSE
		if (
			fetchEconomicActivityTypeDetailsResp !== null &&
			fetchEconomicActivityTypeDetailsResp !== undefined
		) {
			if (fetchEconomicActivityTypeDetailsResp.statusCode === '01') {
				if (fetchEconomicActivityTypeDetailsArr.length > 0) {
					const { economicActivityTypeID, economicActivityTypeName } =
						fetchEconomicActivityTypeDetailsArr[0];

					formik.setValues({
						...formik.values,
						economicActivityTypeID,
						economicActivityTypeName,
						companyID,
						userID,
						userName,
						userAccessBranchID,
						databaseName,
					});
				}
			} else if (fetchEconomicActivityTypeDetailsResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			dispatch(fetchEconomicActivityTypeDetailsResponseResetStart());
		}
		// ECONOMIC ACTIVITY UPDATE RESPONSE
		if (
			economicActivityTypeUpdateResp !== null &&
			economicActivityTypeUpdateResp !== undefined
		) {
			if (economicActivityTypeUpdateResp.statusCode === '01') {
				swalComponent(
					'You’re Good to Go!',
					'Economic Activity Type Updated Successfully',
					'success',
				);
				resetEconomicActivityTypePage();
			} else if (economicActivityTypeUpdateResp.statusCode === '101') {
				dispatch(isEditDetailsStart(false));
				swalComponent('Aborted!', 'Economic Activity Type Already Exits', 'warning');
			} else if (economicActivityTypeUpdateResp.statusCode === '100') {
				swalComponent('Aborted!', 'Let’s give it another go', 'danger');
			} else if (economicActivityTypeUpdateResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			setIsSpinner(false);
			dispatch(updateEconomicActivityTypeDetailsResponseResetStart());
		}
	}, [
		fetchEconomicActivityTypeDetailsResp,
		addEconomicActivityTypeResp,
		economicActivityTypeUpdateResp,
	]);

	// ResetPage Function
	function resetEconomicActivityTypePage() {
		dispatch(isEditDetailsStart(false));
		const fetchData = {
			companyID,
			limit: 0,
			inputSearch: '',
			databaseName,
		};
		dispatch(getEconomicActivityTypeListStart(fetchData));
	}

	// onAuthCallBack Function
	function onAuthCallBack() {
		if (isNewForm) {
			dispatch(addEconomicActivityTypeDetailsStart(formik.values));
		} else {
			dispatch(updateEconomicActivityTypeDetailsStart(formik.values));
		}
	}

	// Handle Esc Key Function
	function handleEscKey(event: any) {
		if (event.key === 'Escape') {
			closePrompt();
			event.stopPropagation();
		}
	}

	// Close Prompt Function
	function closePrompt() {
		showAlert({
			title: 'Are you sure?',
			text: 'Do you want to leave without saving?',
			icon: 'warning',
			confirmButtonText: 'Yes!',
			showCancelButton: true,
		}).then((result) => {
			if (result) {
				resetEconomicActivityTypePage();
			}
		});
	}

	// USEEFFCT HANDLE IN ESCKEY
	useEffect(() => {
		window.addEventListener('keydown', handleEscKey);
		return () => {
			window.removeEventListener('keydown', handleEscKey);
		};
	}, []);

	// Swal Component Function
	function swalComponent(title: string, text: string, icon: any) {
		showAlert({ title, text, icon });
	}

	return (
		<PageWrapper>
			<div className='row  g-4 marginBtm'>
				<div className='col-6'>
					<CardLabel icon='VolunteerActivism' iconColor='info'>
						<CardTitle>Economic Activity Type Details</CardTitle>
					</CardLabel>
				</div>
			</div>
			<div className='row h-100 pb-3'>
				<div className='col-lg-12 col-md-12'>
					<div className='row  g-4'>
						<div className='col-6'>
							<FormGroup
								id='economicActivityTypeName'
								label={
									<>
										Economic Activity Type Name
										<span style={{ color: 'red' }}>*</span>
									</>
								}
								isFloating>
								<Input
									type='text'
									placeholder='Economic Activity Type Name *'
									onBlur={formik.handleBlur}
									onChange={(e) => {
										formik.handleChange(e);
									}}
									value={formik.values.economicActivityTypeName}
									isValid={formik.isValid}
									isTouched={formik.touched.economicActivityTypeName}
									invalidFeedback={formik.errors.economicActivityTypeName}
									validFeedback=''
								/>
							</FormGroup>
						</div>
					</div>
					<hr />
					<div className='col-lg-12 col-md-12'>
						<div className='row  g-4'>
							<div className='col-12'>
								{!isNewForm && isShowEdit ? (
									<Button
										className='float-end'
										color='secondary'
										icon={!isSpinner ? 'update' : ''}
										onClick={formik.handleSubmit}
										isDisable={
											(!formik.isValid && !!formik.submitCount) || isSpinner
										}>
										{isSpinner ? <Spinner isSmall inButton isGrow /> : ''}
										Update Economic Activity Type
									</Button>
								) : isShowAdd ? (
									<Button
										className='float-end'
										color='primary'
										icon={!isSpinner ? 'save' : ''}
										onClick={formik.handleSubmit}
										isDisable={
											(!formik.isValid && !!formik.submitCount) || isSpinner
										}>
										{isSpinner ? <ButtonSpinner /> : ''}
										Add Economic Activity Type
									</Button>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</div>
			<CommonAuthenticationModal
				setAuthModal={setAuthModal}
				authModal={authModal}
				callBack={onAuthCallBack}
			/>
		</PageWrapper>
	);
});

export default EconomicActivityTypeAddComponent;
