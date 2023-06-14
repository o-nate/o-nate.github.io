#!/usr/bin/env python
# coding: utf-8

# # Begin

# In[384]:


# get_ipython().system('conda activate savings-game-data')


# # Declare file name

# In[385]:


# Name of input file
import time
import re
import json
from openpyxl import load_workbook
import pandas as pd
import numpy as np
from tqdm import tqdm
file = "results/all_apps_wide_2023-02-27.csv"

# Declare name of output file
file_prefix = "processed_"


# # Import libraries

# In[386]:


# do not hide rows in output cells
pd.set_option("display.max_rows", None, 'display.max_columns', None)

# turn off warning about df copies
pd.options.mode.chained_assignment = None  # default='warn'


# # Participant fields, player fields, and oTree apps

# In[387]:


participant_fields = [
    'code',
    'label',
    'reaction_times',
    'periods_survived',
    'task_results',
    'task_results_1',
    'task_results_2',
    'task_results_3',
    'task_results_4',
    'remunerated_questions',
    'remunerated_behavioral',
    'selected_savings_game_round',
    'day_1',
    'day_2',
    'day_3',
    'day_4',
    'inflation',
    'day',
    'day_room_number',
    'error',
    'last_room_day',
    'next_room',
    'err_msg',
    'vars_done',
]

apps = [
    'participant',
    'init',
    'Questionnaire',
    'BRET',
    'lossAversion',
    'riskPreferences',
    'wisconsin',
    'timePreferences',
    'Finance',
    'Inflation',
    'Numeracy',
    'task_Instructions',
    'task',
    'task_questions',
    'task_int_rl',
    'task_int_cx',
    'redirectapp',
    'sessionResults',
    'redirecttopayment'
]

# Define new tables per task fields
fields = ['decision', 'total_price', 'initial_savings', 'cashOnHand', 'finalSavings',
          'finalStock', 'interestEarned', 'newPrice', 'realInterest', 'responseTime',
          'current_choiceConfidence', 'inf_estimate', 'inf_expectation']

# Participants to filter out
bugs = [
    'cwr7N2t',
    'WYBNBwc',
    'RZnSnfc',
    'GQjgrZJ',
    'jxRyKJC',
    '2h7jWRr',
    '5Tk8VHT',
    'FygVBWd',
    '0Gp0Bpb',
    'KFjwyrB',
    'nPd3h6T',
    'HXjrKgn',
    'NBRJKxW',
    'nTlJlX5',
    'Bdc71v6',
    'cYJDfGS',
    '7L8DR4T',
    'D1zjtN0',
    'HL8Pyzk',
    '3zSBV3Y',
    '85v3pRW',
    'W1F70Wq',
]


# # Create df and organize

# In[405]:


# make dataframe
complete = pd.read_csv(file)

# remove rows participant.label = NaN
complete = complete[complete['participant.label'].notna()]

# Remove rows with participant.label = bugs (due to bug)
complete = complete[~complete['participant.label'].isin(bugs)]

# remove columns with all NaN
complete = complete.dropna(axis=1, how='all')

# convert participant.time_started_utc value to datetime
complete['participant.time_started_utc'] = pd.to_datetime(complete['participant.time_started_utc'])

# add column with intervention
complete['participant.intervention'] = ""
complete['participant.day_3'] = complete['participant.day_3'].apply(eval)
for i in range(len(complete.index)):
    if complete['participant.day_3'].iloc[i][0] == 'task_int_cx':
        complete['participant.intervention'].iloc[i] = 'intervention'
    else:
        complete['participant.intervention'].iloc[i] = 'control'

# FILTER BY DATE
from_ts = '2023-02-13 00:00:00'
to_ts = '2023-02-13 23:59:00'
# after_ts = '2023-02-17 23:59:00'
complete = complete[
    (complete['participant.time_started_utc'] < from_ts)
    | (complete['participant.time_started_utc'] > to_ts)
    # | (complete['participant.time_started_utc'] > after_ts)
]
# complete = complete[~(complete['participant.time_started_utc'] == '2023-02-13')]

# organize rows by participant.label
# and display corresponding codes
complete = complete.sort_values(['participant.label', 'participant.time_started_utc'], ascending=[False, True])
participant = complete[['participant.label', 'participant.code', 'participant.time_started_utc']]
participant = participant.groupby(['participant.label', 'participant.code', 'participant.time_started_utc']).all()

participant = participant.sort_values(['participant.label', 'participant.time_started_utc'], ascending=[False, True])

# participant
print('shape: ', complete.shape)


# # Generate separate df for each app + for participant info

# In[389]:


def split_df(df):
    for app in apps:
        df_list.append(app)
        if app == 'task' or app == 'task_questions':
            df_dict[app] = df.filter(
                regex=f'participant.code|participant.label|participant.time_started_utc|participant.day|participant.inflation|participant.intervention|{app}.')
        else:
            df_dict[app] = df.filter(
                regex=f'participant.code|participant.label|participant.time_started_utc|participant.day|participant.intervention|{app}.')
        print(f'{app}, shape: ', df_dict[app].shape)
    return df_list


df_dict = {}
df_list = []

split_df(complete)
print('df_list len: ', len(df_list))


# # Adjust app df's

# # Remove columns from certain app df's

# In[390]:


# participant df
df_dict['participant'].drop('participant.task_results', axis=1, inplace=True)
df_dict['participant'].drop('participant._is_bot', axis=1, inplace=True)

# wisconin df
df_dict['wisconsin'].drop('session.config.wisconsin_fee', axis=1, inplace=True)

# task
df_dict['task'].drop(
    list(df_dict['task'].filter(regex='participant.task|session|task_int|task_Instructions|task_questions')),
    axis=1, inplace=True)

# task_questions
df_dict['task_questions'].drop(list(df_dict['task_questions'].filter(regex='session')), axis=1, inplace=True)


# # Remove blank rows
# (i.e. rows for other apps)

# In[391]:


print(len(df_dict))

for app in df_list:
    if app != 'participant':
        print(f'{app}.1.player.id_in_group')
        df_dict[app].dropna(subset=[f'{app}.1.player.id_in_group'], inplace=True)


# # `timePreferences`: Distribute delays into individual columns for each round

# In[392]:


new_timePreferences = pd.DataFrame(data=df_dict['timePreferences']['timePreferences.1.player.delay'].tolist())
new_timePreferences


# In[393]:


new_timePreferences.rename(columns={0: 'delay_order'}, inplace=True)

# convert str to dict
new_timePreferences.dicts = new_timePreferences.delay_order.apply(json.loads)
new_timePreferences['dict_list'] = new_timePreferences.dicts
new_timePreferences['dict_list']

for n in range(len(new_timePreferences['dict_list'][0]['delay'])):
    new_timePreferences[f'{n}'] = n

for i in range(len(new_timePreferences['dict_list'])):
    # print(new_timePreferences['dict_list'][i]['delay'])
    new_timePreferences['dict_list'][i] = new_timePreferences['dict_list'][i]['delay']

for k in range(len(new_timePreferences['dict_list'])):
    for j in range(len(new_timePreferences['dict_list'][0])):
        # print(new_timePreferences['dict_list'][k][j])
        new_timePreferences[f'{j}'][k] = new_timePreferences['dict_list'][k][j]['delay']
        new_timePreferences[f'{j}'] = new_timePreferences[f'{j}']

new_new = new_timePreferences.iloc[:, 2:]

# for k in range(len(new_new.index)):
#     for j in range(len(new_new.columns)):
#         print(k, j, new_new.iloc[k][j])
# delay = new_new.iloc[k][j]['delay']
# new_new.at[k,j] = delay
# print(new_new[k][j], delay)

new_new


# In[394]:


# for k in range(len(new_new.index)):
#     for j in range(len(new_new.columns)):
#         df_dict['timePreferences'].iloc[k][f'timePreferences.{j+1}.player.delay'] = new_new.iloc[k][j]

for k in range(len(new_new.index)):
    for j in range(1, 1 + len(new_new.columns)):
        df_dict['timePreferences'][f'timePreferences.{j}.player.delay'].iloc[k] = new_new.iloc[k][j-1]

df_dict['timePreferences']


# # `riskPreferences`: Convert `raw_responses` to columns

# In[395]:


new_riskPreferences = pd.DataFrame(data=df_dict['riskPreferences']['riskPreferences.1.player.raw_responses'].tolist())
new_riskPreferences.rename(columns={0: 'responses'}, inplace=True)

# remove trial id and '-' from dict key


def risk_responses(text):
    pattern = r'\d{,} - '
    result = re.sub(pattern, '', text)
    return result


new_riskPreferences['responses'] = new_riskPreferences.responses.map(risk_responses)

# convert str to dict
new_riskPreferences.dicts = new_riskPreferences.responses.apply(json.loads)
new_riskPreferences['responses'] = new_riskPreferences.dicts

# convert dict key:value to columns
new_riskPreferences = pd.concat([new_riskPreferences, new_riskPreferences['responses'].apply(pd.Series)], axis=1)

# reorder columns
col_order = []
for i in range(1, 11):
    i = i * 10
    col_order.append(f'{i}')

new_riskPreferences = new_riskPreferences[col_order]

new_riskPreferences

# recombine with riskPreferences df
for j in range(1, 11):
    k = j * 10
    df_dict['riskPreferences'][f'riskPreferences.player.probability.{k}'] = new_riskPreferences[f'{k}'].values

df_dict['riskPreferences']


# In[396]:


new_riskPreferences


# # `lossAversion`: Distribute `raw_responses` to columns

# In[397]:


new_lossAversion = pd.DataFrame(data=df_dict['lossAversion']['lossAversion.1.player.raw_responses'].tolist())
new_lossAversion.rename(columns={0: 'responses'}, inplace=True)

# remove trial id and '-' from dict key


def risk_responses(text):
    pattern_1 = r'\d{,} - '
    pattern_2 = r'\s₮'
    result = re.sub(pattern_1, '', text)
    result = re.sub(pattern_2, '', result)
    return result


new_lossAversion['responses'] = new_lossAversion.responses.map(risk_responses)

# convert str to dict
new_lossAversion.dicts = new_lossAversion.responses.apply(json.loads)
new_lossAversion['responses'] = new_lossAversion.dicts

# convert dict key:value to columns
new_lossAversion = pd.concat([new_lossAversion, new_lossAversion['responses'].apply(pd.Series)], axis=1)
new_lossAversion

# reorder columns
col_order = []
for i in range(2, 8):
    i = i * 100 * 2  # multiply by 2 because double lottery sizes
    col_order.append(f'{i},00')

new_lossAversion = new_lossAversion[col_order]

new_lossAversion

# recombine with lossAversion df
for j in range(2, 8):
    k = j * 100 * 2  # multiply by 2 because double lottery sizes
    df_dict['lossAversion'][f'lossAversion.player.loss.{k}'] = new_lossAversion[f'{k},00'].values

df_dict['lossAversion']


# # Unpack `wisconsin` dict

# # Test data for `wisconsin`

# In[398]:


df_wisc = df_dict['wisconsin']
df_wisc = df_wisc.dropna(axis=0)
df_wisc
# df_wisc = df_wisc.iloc[len(df_wisc.index) - 1:len(df_wisc.index), :]
df_wisc

# convert str to dict
df_wisc.dicts = df_wisc['wisconsin.1.player.response_time'].apply(json.loads)
df_wisc['wisconsin.1.player.response_time'] = df_wisc.dicts

# convert dict key:value to columns
df_wisc = pd.concat([df_wisc, df_wisc['wisconsin.1.player.response_time'].apply(pd.Series)], axis=1)

# ## remove `wisconsin.1.player.response_time`
# df_wisc = df_wisc.drop(columns=['wisconsin.1.player.response_time','participant.time_started_utc'])

# create new df to break up dicts
new = df_wisc.iloc[:, :1]
# break dicts into columns for each trial
for col in range(1, 31):
    new[col] = df_wisc[f'{col}']

# convert list to dict and create columns for each key:value pair
for n in tqdm(range(len(df_wisc.index)), desc='wisc create columns'):
    for col in range(1, 31):
        dict = json.loads(df_wisc[str(col)].iloc[n][0])
        for i in dict:
            new[f'trial_{col}_{i}'] = None

# replace cell values with corresponding key:value pairs
for n in tqdm(range(len(df_wisc.index)), desc='wisc add values'):
    for col in range(1, 31):
        dict = json.loads(df_wisc[str(col)].iloc[n][0])
        for i in dict:
            new[f'trial_{col}_{i}'].iloc[n] = dict[i]


# concatenate new columns with df_wisc
df_wisc = pd.concat([df_wisc, new.iloc[:, 31:]], axis=1)

# remove separated trial number columns
columns = []
for col in range(1, 31):
    df_wisc.drop(str(col), axis=1, inplace=True)
df_wisc

# update original df
df_dict['wisconsin'] = df_wisc


# # `task`: Further clean data

# ## 2

# In[399]:


task = df_dict['task'].copy()

# Drop columns with 'day_'
task.drop(task.filter(regex=f'day_').columns, axis=1, inplace=True)

# Resort by index
task.sort_index(inplace=True)

# Convert 'participant.inflation' to list and extract corresponding day's inf sequence
task['participant.inflation'] = task['participant.inflation'].apply(eval)
for n in range(len(task.index)):
    day = task['participant.day'].iloc[n]
    task['participant.inflation'].iloc[n] = task['participant.inflation'].iloc[n][int(day) - 1]
    # inf = task['participant.inflation'].iloc[n][int(day)]
    # print(inf)

# Move intervention column leftwards
column_to_move = task.pop('participant.intervention')

# insert column with insert(location, column_name, column_value)

task.insert(4, 'participant.intervention', column_to_move)


def split_df_task(df):
    for field in fields:
        task_df_list.append(field)
        task_df_dict[field] = df.filter(
            regex=f'participant.code|participant.label|utc|participant.day|participant.inflation|participant.intervention|{field}$')
        # task_df_dict[field] = df.drop(df.filter(regex=f'day_').columns,axis=1)
        # for
        # print('shape', df[field].shape)
    return task_df_list


task_df_dict = {}
task_df_list = []

split_df_task(task)
# tp = tp.groupby(['participant.inflation','participant.day', 'participant.intervention', 'participant.label']).sum()
# tp.T
# task


# ## group by participant label and time started & transpose
# for df in task_df_list:
#     task_df_dict[df] = task_df_dict[df].groupby(['participant.inflation','participant.day', 'participant.intervention', 'participant.label','participant.time_started_utc']).sum()
#     # print('grouped')
#     task_df_dict[df] = task_df_dict[df].T
#     print('transposed')

# Extract quantity purchased per month
print('making decision now!')
decision = task_df_dict['decision'].copy()

# Replace NaNs in decision
decision.fillna('{"item": [], "quantity": [], "price": []}', inplace=True)

# Convert str to dict
for month in tqdm(range(1, 121)):
    decision[f'task.{month}.player.decision'] = decision[f'task.{month}.player.decision'].apply(json.loads)
    for i in range(len(decision.index)):
        try:
            decision[f'task.{month}.player.decision'].iloc[i] = decision[
                f'task.{month}.player.decision'].iloc[i]['quantity'][0]
        except:
            decision[f'task.{month}.player.decision'].iloc[i] = 0

print('decision type: ', type(decision[f'task.1.player.decision'].iloc[1]))

task_df_dict['decision'] = decision

# add df's to general dict and and list
final_df_dict = df_dict | task_df_dict
final_df_list = df_list + task_df_list


# # TODO: Recombine and order relevant `task` columns

# In[400]:


# # combo = pd.concat([task_df_dict['finalSavings'], task_df_dict['responseTime']], axis=1, keys=['fs', 'rt'])
# df1 = task_df_dict['finalSavings'].T
# df2 = task_df_dict['responseTime'].T
# combo = df1.join(df2)

# col_list = [col for col in combo]
# # for col in range(len(combo.columns)):
# #     col_list.append(combo[col])
# # print(col_list)
# # combo


# # Calculate payment results

# In[401]:


# final_payments = df_dict['participant'].loc[(df_dict['participant']['participant.selected_savings_game_round'].notnull() == True) & (df_dict['participant']['participant._current_app_name'] == 'redirecttopayment')]
final_payments = df_dict['participant'].loc[(
    df_dict['participant']['participant._current_app_name'] == 'redirecttopayment')]
final_payments = final_payments[['participant.label', 'participant.payoff', 'participant.intervention',
                                 'participant.task_results_1', 'participant.task_results_2',
                                 'participant.task_results_3', 'participant.task_results_4', 'participant.day_1',
                                 'participant.day_3', 'participant.remunerated_behavioral_day1',
                                 'participant.remunerated_behavioral_day3']]


# convert from str to list
final_payments['participant.day_1'] = final_payments['participant.day_1'].map(eval)
# final_payments['participant.day_3'] = final_payments['participant.day_3'].map(eval)
final_payments['participant.remunerated_behavioral_day1'] = final_payments['participant.remunerated_behavioral_day1'].map(
    eval)
final_payments['participant.remunerated_behavioral_day3'] = final_payments['participant.remunerated_behavioral_day3'].map(
    eval)


# remove non-behavioral task names from lists
final_payments['participant.day_1'] = final_payments['participant.day_1'].apply(
    lambda x: [i for i in x if i != 'debut'])
final_payments['participant.day_3'] = final_payments['participant.day_3'].apply(
    lambda x: [i for i in x if i != 'task_int_cx'])
final_payments['participant.day_3'] = final_payments['participant.day_3'].apply(
    lambda x: [i for i in x if i != 'task_int_rl'])
# final_payments['participant.day_3'] = final_payments['participant.day_3'].apply(
#     lambda x: [i for i in x if i !='timePreferences'])


# convert day_1 columns into dict
final_payments['results_dict1'] = [{key[0]: val[0]} for key, val in zip(
    final_payments['participant.day_1'], final_payments['participant.remunerated_behavioral_day1'])]


# add day_3 results to dict
for n in range(len(final_payments.index)):
    for j in range(len(final_payments['participant.day_3'].iloc[n])):
        # print(final_payments['participant.day_3'].iloc[n][j], ', ', final_payments['participant.remunerated_behavioral_day3'].iloc[n][j])
        key, val = final_payments['participant.day_3'].iloc[n][j], final_payments['participant.remunerated_behavioral_day3'].iloc[n][j]
        final_payments['results_dict1'].iloc[n][key] = val


# add column with total of four task results
final_payments[f'participant.task_results_total'] = 0
for k in range(len(final_payments.index)):
    for i in range(1, 5):
        final_payments[f'participant.task_results_total'].iloc[
            k] += final_payments[f'participant.task_results_{i}'].iloc[k]


# generate columns for each task with corresponding results
final_payments = pd.concat([final_payments, final_payments['results_dict1'].apply(pd.Series)], axis=1)

final_payments.loc['Total'] = final_payments[['participant.payoff', 'participant.task_results_1',
                                              'participant.task_results_2', 'participant.task_results_3', 'participant.task_results_4',
                                              'participant.task_results_total', 'riskPreferences', 'wisconsin', 'lossAversion', 'BRET']].sum()
final_payments = final_payments.drop(
    ['results_dict1', 'participant.day_1', 'participant.day_3', 'participant.remunerated_behavioral_day1',
     'participant.remunerated_behavioral_day3', 'timePreferences'],
    axis=1)
final_payments = final_payments.fillna('-')
final_df_list.append('final_payments')
final_df_dict['final_payments'] = final_payments
# final_payments


# # Result stats

# In[402]:


stats_final_payments = final_payments[final_payments['participant.label'] != '-'].describe()
final_df_list.append('stats_final_payments')
final_df_dict['stats_final_payments'] = stats_final_payments
stats_final_payments


# timestr = time.strftime("%Y%m%d-%H%M%S")
# print(timestr)
# new_file = file.replace('csv', 'xlsx')
# with pd.ExcelWriter(f'{file_prefix}_{timestr}_{new_file}') as writer:
#     complete.to_excel(writer, sheet_name='complete')
#     print('complete')
#     # participant.to_excel(writer, sheet_name='participant')
#     for app in final_df_list:
#         final_df_dict[app].to_excel(writer, sheet_name=f'{app}')
#         print(f'final_df_dict[{app}]')
