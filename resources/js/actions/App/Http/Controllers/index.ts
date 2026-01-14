import DashboardController from './DashboardController'
import HotelController from './HotelController'
import AssignManagerController from './AssignManagerController'
import RoomController from './RoomController'
import GuestController from './GuestController'
import BookingController from './BookingController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
HotelController: Object.assign(HotelController, HotelController),
AssignManagerController: Object.assign(AssignManagerController, AssignManagerController),
RoomController: Object.assign(RoomController, RoomController),
GuestController: Object.assign(GuestController, GuestController),
BookingController: Object.assign(BookingController, BookingController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers