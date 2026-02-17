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

    async sign_up(email, password, metadata = {}){
        try {
            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: metadata
                }
            });

            if (error) throw error;

            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            return { success: false, error: error.message };
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
    }
};

window.SupabaseAuth = SupabaseAuth;

