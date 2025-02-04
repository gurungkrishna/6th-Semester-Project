import UserModel from "../models/model.js";




const viewProfileEdit=async (req, res) => {
    try {
        const loggedInUser = req.user;  // Logged-in user (admin)
        const userId = loggedInUser._id;  // Get logged-in user's ID
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log(user)

        if (user.role === "user") {
            // If regular user, render 'edit-profile' view
            res.render('edit-profile', { loggedInUser, user ,message: ''});
        } else if (user.role === "admin") {
            // If admin, render 'adminEditProfile' view and pass necessary data
            const users = await UserModel.find();  // Fetch all users for admin to manage
            const selectedUserId = req.query.userId || userId;
            const userToEdit = await UserModel.findById(selectedUserId);

            // Pass 'loggedInUser', 'user', 'users', and 'userToEdit' to the template
            res.render('adminEditProfile', { loggedInUser, user, users, userToEdit, message: '' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


const updateUserProfile=async (req, res) => {
    const userId = req.user._id;
    const { fname, lname, email, password } = req.body;

    // Find the user by ID and update their profile
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { fname, lname, email, password }, { new: true });

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
       
        // Redirect to the 'home' page after successful update
        res.redirect('/edit-profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


const updateAdminProfile=async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }

    const { userId, fname, lname, email, password } = req.body;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { fname, lname, email, password }, { new: true });

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        
        // Redirect to the 'adminEditProfile' page after successful update
        res.redirect(`/edit-profile?userId=${userId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const profileManagementController={
    viewProfileEdit,
    updateUserProfile,
    updateAdminProfile
}

export default profileManagementController