import pandas as pd
import cyrtranslit as cy
import os
import re

file_name = 'OSTIS2020.xlsx'
MAIN_IDFT = '=> nrel_main_idtf: ['
LANG_EN = '] (* <- lang_en;; *);'
LANG_RU = '] (* <- lang_ru;; *);'


def read_data_from_file(file_name):
    df = pd.read_excel(file_name)
    df = df.drop(['Отметка времени'], axis=1)
    df.columns = ['fio_ru', 'fio_en', 'ac_degree', 'ac_title', 'branc_degree', \
                  'email', 'm_phone', 'w_phone', 'work_place', \
                  'work_position', 'city', 'country']
    return df


def translit_to_fio_en(fio_ru):
    fio_en = cy.to_latin(fio_ru, 'ru')
    fio_en = (fio_en.split()[0:2])
    fio_en = str(fio_en[0]).capitalize().replace('j', 'y') + ' ' + str(fio_en[1]).capitalize().replace('j', 'y')
    return fio_en


def create_file_name(fio_ru):
    last_name_ru = cy.to_latin(fio_ru, 'ru').replace('J', 'Y').replace("'", "").replace('j', 'y')
    last_name_ru = last_name_ru.split()
    first_letter_in_fn = last_name_ru[1][0]
    if len(last_name_ru) == 3:  #
        try:
            first_letter_in_fan = '_' + last_name_ru[2][0]
        except:
            pass
    else:
        first_letter_in_fan = ''
    last_name_ru = str(last_name_ru[0]).capitalize() + '_' + first_letter_in_fn + first_letter_in_fan
    return last_name_ru


def create_first_record(fio_ru):
    first_record = cy.to_latin(fio_ru, 'ru')
    first_record = first_record.split()
    first_record = str(first_record[0]).capitalize().replace('j', 'y').replace('J', 'Y').replace("'", '') + '_' \
                   + str(first_record[1]).capitalize().replace('j', 'y').replace('J', 'Y').replace("'", '')
    return first_record


def create_main_idtf_en(fio_ru):
    fio_en = cy.to_latin(fio_ru, 'ru')
    fio_en = fio_en.split()
    fio_en = str(fio_en[0]).capitalize().replace('j', 'y').replace('J', 'Y').replace("'", '') \
             + ' ' + str(fio_en[1]).capitalize().replace('j', 'y').replace('J', 'Y').replace("'", '')
    return fio_en


def create_main_idtf_ru(fio_ru):
    fio_ru = fio_ru.split()
    if len(fio_ru) == 3:
        fio_ru2 = fio_ru[2]
    else:
        fio_ru2 = ''
    fio_ru = MAIN_IDFT + str(fio_ru[0]).capitalize() + ' ' + str(fio_ru[1]).capitalize() + ' ' + fio_ru2 + LANG_RU
    return fio_ru


def create_country_idf(country):
    prefics = '=>nrel_place_of_living:'
    country = country.split('/')[0].strip()
    if country in ('Беларусь', 'Республика Беларусь', 'Republic of Belarus', 'РБ'):
        country = 'Belarus'
    elif country in ('Российская федерация', 'Россия', 'Российская Федерация', 'РФ'):
        country = 'Russia'
    elif country == 'Украина':
        country = 'Ukraina'

    return prefics + country + ';'


def create_city_idf(city):
    city = cy.to_latin(city, 'ru').strip().split('/')[0].replace("'", '').replace('J', 'Y').replace('j', 'y')
    prefics = '=>nrel_place_of_living:'

    return prefics + city + ';'


def create_work_phone(work_phone):
    prefix = '=>nrel_phone_number:['
    work_phone = str(work_phone).replace('(', '').replace(')', '')

    return prefix + work_phone + '];'


def create_email(email):
    prefics = '=>nrel_email:['
    return prefics + email + '];'


def create_m_phone(m_phone):
    prefix = '=>nrel_mobile_phone_number:['
    m_phone = str(m_phone).replace('(', '').replace(')', '')

    return prefix + m_phone + '];'


def create_concept_title(ac_title):
    try:
        ac_title = str(ac_title).strip().split('/')[1]
        if ac_title == ' Prof.':
            ac_title = 'professor;'
        elif ac_title == ' None' or ' None, Graduate student':
            ac_title = 'no_scientific_title;'
        elif ac_title == ' Assoc.Prof.':
            ac_title = 'assocprofessor'
        elif ac_title == ' Leading researcher':
            ac_title = 'leadingresearcher'
        elif ac_title == ' Junior researcher':
            ac_title = 'juniorresearcher'
        elif ac_title == ' Senior researcher':
            ac_title = 'seniorresearcher'
    except:
        ac_title = 'error'

    return '<-concept_' + ac_title


def create_concept_degree(ac_degree):
    try:
        ac_degree = str(ac_degree).strip().split('/')[1]
        if ac_degree == ' PhD':
            ac_degree = 'PhD;;'
        elif ac_degree == ' Grand PhD':
            ac_degree = 'Grand_PhD;;'
        elif ac_degree == ' Master of Engineering':
            ac_degree = 'master_of_engineering;;'
        elif ac_degree == ' None':
            ac_degree = 'no_scientific_degree;;'
        elif ac_degree == ' None':
            ac_degree = 'no_scientific_degree;;'
    except:
        ac_degree = cy.to_latin(ac_degree, 'ru').replace("'", '').replace(' ', '_')+";;"
    return '<-concept_' + ac_degree


def normalize_work_place(work_place):
    # output = "".join(item[0].upper() for item in re.findall("\w+", input))
    try:
        work_place = str(work_place).split('/')[1].strip().split(' ')
        work_place = '_'.join(work_place).replace('"', '')

    except:
        work_place = 'noname_work_place'

    return work_place


def normalize_work_pos(work_pos):
    try:

        work_pos = str(work_pos).lower().strip().split('/')[1].strip().split(' ')
        work_pos = '_'.join(work_pos)
    except:
        work_pos = 'noname_work_pos'
    return work_pos


def data_normalized(data):
    data['first_record'] = data['fio_ru'].map(create_first_record)
    data['main_idtf_en'] = data['fio_ru'].map(create_main_idtf_en)
    data['main_idtf_ru'] = data['fio_ru'].map(create_main_idtf_ru)
    data['fio_en'] = data['fio_ru'].map(translit_to_fio_en)
    data['file_name'] = data['fio_ru'].map(create_file_name)
    data['country_of_living'] = data['country'].map(create_country_idf)
    data['city_of_living'] = data['city'].map(create_city_idf)
    data['nrel_w_phone'] = data['w_phone'].fillna('no phone number').map(create_work_phone)
    data['nrel_email'] = data['email'].fillna('no email').fillna('no email').map(create_email)
    data['nrel_m_phone'] = data['m_phone'].fillna('no phone number').map(create_m_phone)
    data['c_s_t'] = data['ac_title'].map(create_concept_title)
    data['c_s_d'] = data['ac_degree'].map(create_concept_degree)
    data['work_place_n'] = data['work_place'].map(normalize_work_place)
    data['w_p_n'] = data['work_position'].map(normalize_work_pos)

    return data


def save_transfom_data(dfn):
    path = os.getcwd()
    for index, row in dfn.iterrows():
        with open(path + '/' + str(row['file_name']) + '.scs', 'w') as file:
            file.write(row['file_name'] + '\n')
            file.write(MAIN_IDFT + row['main_idtf_en'] + LANG_EN + '\n')
            file.write(row['main_idtf_ru'] + '\n')
            file.write(row['country_of_living'] + '\n')
            file.write(row['city_of_living'] + '\n')
            file.write('<-participants_OSTIS_2020;' + '\n')
            file.write('<-concept_human;' + '\n')
            file.write(row['nrel_w_phone'] + '\n')
            file.write(row['nrel_email'] + '\n')
            file.write(row['nrel_m_phone'] + '\n')
            file.write(row['c_s_t'] + '\n')
            file.write(row['c_s_d'] + '\n')
            file.write(
                row['work_place_n'] + '->' + 'rrel_' + row['w_p_n'] + ':' +
                row['file_name'] + ';;')

def main(fn):
    df = read_data_from_file(fn)
    dfn = data_normalized(df)
    save_transfom_data(dfn)


if __name__ == '__main__':
    main(file_name)
