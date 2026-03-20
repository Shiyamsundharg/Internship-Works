// Version : 0.0.3
// Author : VISHAL,ARANVINDHAN,VISHNU
// LastEdit : SHIYAM
// Last ADD : swalComponent changed to show notification and notification message changes done
// MODFIED DATE : 11-08-2025

/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Select from '../../../../components/bootstrap/forms/Select';
import Option from '../../../../components/bootstrap/Option';
import Button from '../../../../components/bootstrap/Button';
import Input from '../../../../components/bootstrap/forms/Input';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Spinner from '../../../../components/bootstrap/Spinner';
import ButtonSpinner from '../../../_common/ButtonSpinner';
import '../../../../styles/common/_common.scss';
import { isEditDetailsStart } from '../../../../redux/general/general.action';
import {
	addEconomicActivityDetailsStart,
	addEconomicActivityDetailsResponseResetStart,
	fetchEconomicActivityDetailsResponseResetStart,
	updateEconomicActivityDetailsStart,
	updateEconomicActivityDetailsResponseResetStart,
	getEconomicActivityListStart,
} from '../../../../redux/master/economicActivity/economicActivity.action';
import { getLoginObjDetails } from '../../../../redux/login/login.selector';
import {
	selectAddEconomicActivity,
	selectFetchEconomicActivityDetails,
	selectFetchEconomicActivityData,
	selectUpdateEconomicActivity,
} from '../../../../redux/master/economicActivity/economicActivity.selector';
import LabelWithRequired from '../../../_common/LabelWithRequired';
import showAlert from '../../../_common/SwalAlert';
import generalLoadUserControl from '../../../../common/function/generalLoadUserControl';
import CommonAuthenticationModal from '../../../_common/CommonAuthenticationModal';
import showNotification from '../../../../components/extras/showNotification';
import { selectFetchAllEconomicActivityTypeData } from '../../../../redux/master/economic-activity-type/economic-activity-type.selector';

const EconomicActivityAddComponent = ({ isNewForm }: any) => {
	const dispatch = useDispatch();

	/****** LOGIN DATA **********/
	const loginData = useSelector(getLoginObjDetails);

	/****** ADD/UPDATE ECONOMIC ACTIVITY  **********/
	const addEconomicActivityResp = useSelector(selectAddEconomicActivity);
	const economicActivityUpdateResp = useSelector(selectUpdateEconomicActivity);

	/****** FETCH ECONOMIC ACTIVITY DETAILS  **********/
	const fetchEconomicActivityDetailsResp = useSelector(selectFetchEconomicActivityDetails);
	const fetchEconomicActivityDetailsArr = useSelector(selectFetchEconomicActivityData);

	/****** FETCH ALL ECONOMIC ACTIVITY TYPE  **********/
	const fetchEconomicActivityTypeArr = useSelector(selectFetchAllEconomicActivityTypeData);
	const usercontrolaccess = generalLoadUserControl('Master', 'Economic Activity', loginData);
	const { isShowAdd, isShowEdit } = usercontrolaccess;

	const {
		companyID,
		userID,
		userName,
		userAccessBranchID,
		databaseName,
		isAuthenticationNeeded,
	} = loginData;

	const [authModal, setAuthModal] = useState(false);
	const [isSpinner, setIsSpinner] = useState(false);
	const [activityListArr, setActivityArr] = useState([
		{
			EconomicActivityID: '',
			EconomicActivityName: '',
			EconomicActivityTypeID: '',
			EconomicActivityTypeName: '',
		},
	]);

	// SWALCOMPONENT FUNCTIONS
	function swalComponent(title: string, text: string, icon: any) {
		showAlert({ title, text, icon });
	}
	// USE EFFECT FUNCTIONS
	useEffect(() => {
		// ADD ECONOMIC ACTIVITY RESPONSE
		if (addEconomicActivityResp !== null) {
			if (addEconomicActivityResp.statusCode === '01') {
				swalComponent(
					'You’re Good to Go!',
					'Economic Activity Details Added Successfully',
					'success',
				);
				resetEconomicActivityPage();
			} else if (addEconomicActivityResp.statusCode === '101') {
				swalComponent('Aborted!', 'EconomicActivity Already Exits', 'error');
			} else if (addEconomicActivityResp.statusCode === '100') {
				swalComponent('Aborted!', 'Let’s give it another go', 'danger');
			} else if (addEconomicActivityResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			setIsSpinner(false);
			dispatch(addEconomicActivityDetailsResponseResetStart());
		}

		// FETCH ECONOMIC ACTIVITY DETAILS RESPONSE
		if (fetchEconomicActivityDetailsResp !== null) {
			if (fetchEconomicActivityDetailsResp.statusCode === '01') {
				if (fetchEconomicActivityDetailsArr) {
					const data = {
						EconomicActivityID: fetchEconomicActivityDetailsArr[0].EconomicActivityID,
						EconomicActivityName:
							fetchEconomicActivityDetailsArr[0].EconomicActivityName,
						EconomicActivityTypeID:
							fetchEconomicActivityDetailsArr[0].EconomicActivityTypeID,
						EconomicActivityTypeName:
							fetchEconomicActivityDetailsArr[0].EconomicActivityTypeName,
					};
					setActivityArr([data]);
				}
			} else if (fetchEconomicActivityDetailsResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			dispatch(fetchEconomicActivityDetailsResponseResetStart());
		}

		// ECONOMIC ACTIVITY UPDATE RESPONSE
		if (economicActivityUpdateResp !== null) {
			if (economicActivityUpdateResp.statusCode === '01') {
				swalComponent(
					'You’re Good to Go!',
					'Economic Activity Details Updated Successfully',
					'success',
				);
				resetEconomicActivityPage();
			} else if (economicActivityUpdateResp.statusCode === '101') {
				dispatch(isEditDetailsStart(false));
				swalComponent('Aborted!', 'Economic Activity Type Already Exits', 'warning');
			} else if (economicActivityUpdateResp.statusCode === '100') {
				swalComponent('Aborted!', 'Let’s give it another go', 'danger');
			} else if (economicActivityUpdateResp.statusCode === '111') {
				showNotification(
					'Aborted!',
					'Your request couldn’t be processed at the moment',
					'danger',
				);
			}
			setIsSpinner(false);
			dispatch(updateEconomicActivityDetailsResponseResetStart());
		}
	}, [fetchEconomicActivityDetailsResp, addEconomicActivityResp, economicActivityUpdateResp]);

	// reset Economic Activity Page Function
	function resetEconomicActivityPage() {
		dispatch(isEditDetailsStart(false));
		const fetchData = {
			companyID,
			limit: 0,
			inputSearch: '',
			databaseName,
		};
		dispatch(getEconomicActivityListStart(fetchData));
	}

	// on Save Verification Function
	function onSaveVerification() {
		if (activityListArr.length === 0) {
			swalComponent('Warning !', 'Add Economic Activity', 'warning');
			return;
		}
		for (let i = 0; i < activityListArr.length; i++) {
			const activity = activityListArr[i];
			if (!activity.EconomicActivityName?.trim()) {
				swalComponent('Warning !', 'Enter Economic Activity Name', 'warning');
				return;
			}
			if (!activity.EconomicActivityTypeID) {
				swalComponent('Warning !', 'Select Economic Activity Type', 'warning');
				return;
			}
		}
		if (isAuthenticationNeeded === '1') {
			setAuthModal(true);
			return;
		}
		const formData = {
			companyID,
			userID,
			userName,
			userAccessBranchID,
			databaseName,
			activityListArr,
		};
		setIsSpinner(true);
		dispatch(
			isNewForm
				? addEconomicActivityDetailsStart(formData)
				: updateEconomicActivityDetailsStart(formData),
		);
	}

	// onAuthCallBack Function
	function onAuthCallBack() {
		setIsSpinner(true);

		const formData = {
			companyID,
			userID,
			userName,
			userAccessBranchID,
			databaseName,
			activityListArr,
		};

		const action = isNewForm
			? addEconomicActivityDetailsStart
			: updateEconomicActivityDetailsStart;

		dispatch(action(formData));
	}

	// removed Activity Function
	function removedActivity(index: any) {
		const listActiveArr = activityListArr;
		if (listActiveArr.length > 0) {
			listActiveArr.splice(index, 1);
			setActivityArr([...listActiveArr]);
		}
	}

	// on Add Economic Activity Function
	function onAddEconomicActivity() {
		setActivityArr([
			...activityListArr,
			{
				EconomicActivityID: '',
				EconomicActivityName: '',
				EconomicActivityTypeID: '',
				EconomicActivityTypeName: '',
			},
		]);
	}

	// on Economic Activity Name Change Function
	function onEconomicActivityNameChange(index: any, value: any) {
		const listCopy = [...activityListArr];
		listCopy[index] = {
			...listCopy[index],
			EconomicActivityName: value || '',
		};
		setActivityArr(listCopy);
	}

	// on Economic Activity Type Change Function
	function onEconomicActivityTypeChange(index: any, e: any) {
		const updatedList = [...activityListArr];
		const selectedValue = e.target.value;

		if (selectedValue && selectedValue !== '') {
			const obj = fetchEconomicActivityTypeArr.find(
				(val: any) => val.EconomicActivityTypeID === selectedValue,
			);

			if (obj) {
				updatedList[index] = {
					...updatedList[index],
					EconomicActivityTypeID: selectedValue,
					EconomicActivityTypeName: obj.EconomicActivityTypeName,
				};
			}
		}
		setActivityArr(updatedList);
	}
	return (
		<PageWrapper>
			<div className='row h-100 pb-3'>
				<div className='col-lg-12 col-md-12'>
					{activityListArr
						? activityListArr.map((data, index) => (
								<div className='row  g-4 mt-2'>
									<div className='col-5'>
										<FormGroup
											id='EconomicActivityName'
											label={
												<LabelWithRequired
													labelText='Economic Activity Name'
													required={true}
												/>
											}
											isFloating>
											<Input
												placeholder='EconomicActivity Name *'
												onChange={(e: any) => {
													onEconomicActivityNameChange(
														index,
														e.target.value,
													);
												}}
												value={data.EconomicActivityName}
											/>
										</FormGroup>
									</div>
									<div className='col-5'>
										<FormGroup
											id='EconomicActivityTypeID'
											label='Economic Activity Type'
											isFloating>
											<Select
												ariaLabel='Economic Activity Type'
												placeholder='Select Economic Activity Type'
												onChange={(e: any) => {
													onEconomicActivityTypeChange(index, e);
												}}
												value={data.EconomicActivityTypeID}>
												<Option value=''>
													Select Economic Activity Type
												</Option>
												{fetchEconomicActivityTypeArr &&
													fetchEconomicActivityTypeArr.length > 0 &&
													fetchEconomicActivityTypeArr.map(
														(item: any) => (
															<Option
																value={item.EconomicActivityTypeID}
																key={item.EconomicActivityTypeID}>
																{item.EconomicActivityTypeName}
															</Option>
														),
													)}
											</Select>
										</FormGroup>
									</div>

									{isNewForm && index === 0 ? (
										<div className='col-2'>
											<Button
												color='info'
												icon='add'
												size='lg'
												onClick={() => onAddEconomicActivity()}
											/>
										</div>
									) : null}

									{isNewForm && index > 0 ? (
										<div className='col-2'>
											<Button
												color='danger'
												icon='delete'
												size='lg'
												onClick={(i) => removedActivity(i)}
											/>
										</div>
									) : null}
								</div>
							))
						: null}

					<hr className='mt-4' />

					<div className='row  g-4 mt-5'>
						<div className='col-12' style={{ textAlign: 'left' }}>
							{isNewForm && isShowAdd ? (
								<Button
									className='float-end'
									color='primary'
									icon={!isSpinner ? 'save' : ''}
									onClick={onSaveVerification}
									isDisable={isSpinner}>
									{isSpinner ? <ButtonSpinner /> : ''}
									Add Economic Activity
								</Button>
							) : !isNewForm && isShowEdit ? (
								<Button
									className='float-end'
									color='secondary'
									icon={!isSpinner ? 'update' : ''}
									onClick={onSaveVerification}
									isDisable={isSpinner}>
									{isSpinner ? <Spinner isSmall inButton isGrow /> : ''}
									Update Economic Activity
								</Button>
							) : null}
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
};
export default EconomicActivityAddComponent;
