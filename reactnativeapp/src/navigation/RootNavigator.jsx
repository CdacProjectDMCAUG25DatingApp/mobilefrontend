    import React from 'react';
    import AuthNavigator from './AuthNavigator';
    import MainNavigator from './MainNavigator';

    const RootNavigator = () => {
    // DIRECTLY show Auth first
    return <AuthNavigator />;
    };

    export default RootNavigator;
