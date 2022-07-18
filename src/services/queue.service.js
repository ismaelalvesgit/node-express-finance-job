import { publish } from "../amqpClient";

/**
 * @typedef PublishQeue
 * @type {Object}
 * @property {string} router
 * @property {string} routingKey
 * @property {Object} content
 */

/**
 * 
 * @param {PublishQeue} data 
 * @returns { Promise<boolean> }
 */
export const publishQeue = (data)=>{
    const { router, routingKey, content } = data;
    return publish(
        router,
        routingKey,
        content
    );
};
