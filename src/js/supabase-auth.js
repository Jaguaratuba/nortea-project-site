const SupabaseAuth = {
    async sign_in(email, password){
        try {
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async sign_up(email, password, metadata = {}) {
        try {
            const redirectTo = `${window.location.origin}/register-success.html`;

            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: metadata,
                    emailRedirectTo: redirectTo
                }
            });

            if (error) throw error;

            return {
                success: true,
                user: data.user,
                session: data.session
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    async sign_out(){
        try {
            const { error } = await window.supabaseClient.auth.signOut();
            if (error) throw error;
                return { success: true};
        } catch (error) {
            return { error: error.message };
        }
    },

    async get_current_user(){
        try {
            const { data: { user }, error } = await window.supabaseClient.auth.getUser();
            if (error) throw error;
                return { success: true, user: user };
        } catch (error) {
            return { success: false, error: error.message, user: null };
        }    
    },

    async get_session(){
        try {
            const { data: { session }, error } = await window.supabaseClient.auth.getSession();
            if (error) throw error;
                return { success: true, session: session };
        } catch (error) {
            return { success: false, error: error.message, session: null };
        }
    },

    onAuthStateChange(callback) {
        return window.supabaseClient.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    },

    async reset_password_for_email(email){
        try {
            const redirectTo = `${window.location.origin}/reset-password.html`;
            const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async update_password(newPassword){
        try {
            const { data, error } = await window.supabaseClient.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

window.SupabaseAuth = SupabaseAuth;
