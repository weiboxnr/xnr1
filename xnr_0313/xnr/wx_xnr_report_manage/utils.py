#-*- coding: utf-8 -*-
import os
import json
import time
from xnr.global_utils import es_xnr,wx_report_management_index_name,wx_report_management_index_type
from xnr.time_utils import ts2yeartime,ts2datetime,datetime2ts
from xnr.parameter import USER_NUM, MAX_SEARCH_SIZE,DAY
from xnr.wx_xnr_report_management_mappings import wx_report_management_mappings
from xnr.wx.control_bot import load_wxxnr_redis_data

def dump_date(period, startdate, enddate):
    if period == '':
        period = -1 #flag
        start_ts = datetime2ts(startdate)
        end_ts = datetime2ts(enddate)
    else:
        period = int(period)
        if period == 0:
            end_ts = int(time.time())
            start_ts = datetime2ts(ts2datetime(end_ts))
        else:
            end_ts = datetime2ts(ts2datetime(int(time.time()))) - DAY
            start_ts = end_ts - (period - 1) * DAY
    return start_ts, end_ts, period

def utils_show_report_content(wxbot_id, report_type, period, startdate, enddate):
    start_ts, end_ts, period = dump_date(period, startdate, enddate)
    xnr_puid = load_wxxnr_redis_data(wxbot_id=wxbot_id, items=['puid'])['puid']
    result = []
    query_body = {
            'query':{
                'bool':{
                    'must':[
                        {'term':{'report_type': report_type}},
                        {'range':{'report_time':{'gte':start_ts, 'lte':end_ts}}},
                        {'term':{'xnr_user_no': wxbot_id}},
                        {'term':{'xnr_puid': xnr_puid}}
                        ]
                    }
                },
            'size': MAX_SEARCH_SIZE,
            'sort': [{'report_time':{'order':'desc'}}]
            }
    try:
        wx_report_management_mappings()
        es_result = es_xnr.search(index=wx_report_management_index_name, doc_type=wx_report_management_index_type, body=query_body)['hits']['hits']
        if es_result:
            result = [item['_source'] for item in es_result]
    except Exception,e:
        print e
    return result