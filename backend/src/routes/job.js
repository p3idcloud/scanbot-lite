'use strict';
const job = require('../controllers/job.controller');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  /api/jobs:
 *   get:
 *    summary: Get all jobs
 *    description: Get all jobs by query
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Jobs
 *    responses:
 *     200:
 *      description: Get all jobs succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Job'
 *     500:
 *      description: Get all jobs failure
 */
router.get('/', job.getJobsFromQuery); // read

/**
 * @swagger
 * /api/jobs:
 *  post:
 *    summary: Create job
 *    description: Create a job
 *    security:
 *    - bearerAuth: []
 *    tags:
 *      - Jobs
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Job'
 *    responses:
 *      200:
 *        description: Successfully create job
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Job'
 *      500:
 *        description: Create job failure
 */
 router.post('/', job.insertJob); // create
 
 /**
 * @swagger
 *  /api/jobs/{jobId}:
 *   get:
 *    summary: Get one job
 *    description: Get one job
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: jobId
 *        required: true
 *        schema:
 *         type: string
 *         minimum: 1
 *        description: Job ID
 *    tags:
 *      - Jobs
 *    responses:
 *     200:
 *      description: Get one job succesfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Job'
 *     400:
 *      description: Couldn't find job
 *     500:
 *      description: Get one job failure
 */
router.get('/:jobId', job.getJobFromId); // read: jobId

/**
 * @swagger
 * /api/jobs/{jobId}:
 *  patch:
 *    summary: Update job
 *    description: Update a job
 *    security:
 *    - bearerAuth: []
 *    tags:
 *      - Jobs
 *    parameters:
 *      - in: path
 *        name: jobId
 *        schema:
 *          type: string
 *        required: true
 *        description: Job Id
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Job'
 *    responses:
 *      200:
 *        description: Successfully update job
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Job'
 *      500:
 *        description: Update job failure
 */
 router.patch('/:jobId', job.updateJobFromId); // update :jobid

 /**
 * @swagger
 * /api/jobs/{jobId}:
 *  delete:
 *   summary: Delete job
 *   description: Delete a job
 *   security:
 *    - bearerAuth: []
 *   tags:
 *    - Jobs
 *   parameters:
 *    - in: path
 *      name: jobId
 *      schema:
 *        type: string
 *      required: true
 *      description: Job Id
 *   responses:
 *    200:
 *      description: Successfully delete job
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Job'
 *    500:
 *      description: Delete job failure
 */
router.delete('/:jobId', job.deleteJobFromId); // delete

module.exports = router;