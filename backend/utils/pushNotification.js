/**
 * Push notification stub — placeholder for future FCM implementation.
 * Returns false (notification not sent) so callers can handle gracefully.
 */
const sendPushNotification = async (userId, title, body) => {
    // TODO: Implement FCM push notifications when ready
    // For now, return false to indicate notification was not sent
    return false;
};

module.exports = { sendPushNotification };
