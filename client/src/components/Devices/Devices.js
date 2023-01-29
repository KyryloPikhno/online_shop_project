import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {useSearchParams} from "react-router-dom";

import {accountActions, deviceActions} from "../../redux/slices";
import {PaginationDevice} from "../PaginationDevice/PaginationDevice";
import {Device} from "../Device/Device";
import {Banner} from "../Banner/Banner";
import css from './Devices.module.css';


const Devices = () => {
    const {devicesResponse} = useSelector(state => state.deviceReducer);

    let [query] = useSearchParams({});

    const dispatch = useDispatch()

    const deleter = async (_id) => {
        try {
            await dispatch(deviceActions.deleteDevice({_id}))
        } catch (e) {
            console.log(e.message)
        }
    };

    useEffect(() => {
        dispatch(deviceActions.getAll({
            page: query.get('page') || 1,
            limit: query.get('limit') || 8,
            name: query.get('name'),
            category: query.getAll('category').toString(),
            price_gte: query.get('price_gte'),
            price_lte: query.get('price_lte'),
            color: query.get('color'),
            brand: query.get('brand')
        }))
    }, [query]);

    useEffect(() => {
        dispatch(accountActions.getByAccess())
    }, []);

    return (
        <div className={css.container}>
            <Banner/>
            <div className={css.devices}>
                {devicesResponse.devices && devicesResponse.devices.map(device => <Device key={device._id}
                                                                                          device={device}
                                                                                          deleter={deleter}/>)}
            </div>
            {
                (devicesResponse.total_pages && devicesResponse.page) &&
                <PaginationDevice total_pages={devicesResponse.total_pages} page={devicesResponse.page}/>
            }
        </div>
    );
};


export {Devices};