printf "Parsing filename: $1...\n\n"

#JSON KEYS:
MONGODB_URL_JSON="mondodb_url"
MONGODB_PW_JSON="mongo_db_password"
EMQX_URL_JSON="emqx_url"
EMQX_PW_JSON="emqx_password"
KC_URL_JSON="keycloak_url"
KC_PW_JSON="keycloak_password"
APP_SECRET_JSON="app_secret_string"
JWT_SECRET_JSON="jwt_secret"
MINIO_KEY_JSON="minio_key"
MINIO_SECRET_JSON="minio_secret"
MINIO_CONSOLE_URL_JSON="minio_name"
MINIO_STORAGE_URL_JSON="storage_name"

#ENV KEYS:
MONGODB_URL="MONGODB_URL"
MONGODB_PW="MONGODB_PW"
APP_SECRET="APP_SECRET"
AWS_ACCESS_KEY="AWS_ACCESS_KEY"
AWS_SECRET_KEY='AWS_SECRET_KEY'
AWS_ENDPOINT="AWS_ENDPOINT"
AWS_CONSOLE="AWS_CONSOLE"
JWT_SECRET="JWT_SECRET"
MQTT_ENDPOINT="MQTT_ENDPOINT"
EMQ_ENDPOINT="EMQ_ENDPOINT"
EMQ_PW="EMQ_PW"
KEYCLOAK_SSO_LOGIN_URL="KEYCLOAK_SSO_LOGIN_URL"
KEYCLOAK_PW="KEYCLOAK_PW"

ENV_LIST=()
VALUE_LIST=()

write_to_env () {
    filename_dev='backend/.env.development'
    filename_prod='backend/.env.production'
    
    # dev
    while read line
    do
        for i in "${!ENV_LIST[@]}";
        do
            if [[ $line =~ ^${ENV_LIST[$i]}* ]];
            then
                line="${line%%=*}=${VALUE_LIST[$i]}"
            fi
        done
        echo $line >> 'backend/.env.development.temp'
    done < $filename_dev

    # prod
    while read line
    do
        for i in "${!ENV_LIST[@]}";
        do
            if [[ $line =~ ^${ENV_LIST[$i]}* ]];
            then
                line="${line%%=*}=${VALUE_LIST[$i]}"
            fi
        done
        echo $line >> 'backend/.env.production.temp'
    done < $filename_prod
    
    cp -fr backend/.env.production.temp backend/.env.development
    cp -fr backend/.env.production.temp backend/.env.production
    rm backend/.env.production.temp
    rm backend/.env.development.temp
    return
}

add_to_env () {
    # $1 for env key $2 for value
    # Checks if key exists in env and appends it
    ENV_LIST+=($1)
    VALUE_LIST+=($2)
}

CURRENTVAR=""
MONGOURL=""

# Defaults
add_to_env "AWS_REGION" "us-east-1"
add_to_env "MINIO_PORT" "443"
add_to_env "MINIO_USE_SSL" "true"

for line in $(<$1);
do
    case $CURRENTVAR in
        $MONGODB_URL)
            line=${line%?}
            host=${line%%:*}
            rest=${line#*:}
            port=${rest%%.*}
            rest=${rest#*.}
            rest=${rest%?}
            MONGOURL+="$host.$rest:$port/twainNew?authSource=admin&readPreference=primary&ssl=false\""
            CURRENTVAR=""
            ;;
        $MONGODB_PW)
            line=${line%??}
            line=${line#*\"}
            MONGOURL=${MONGOURL#\"}
            MONGOURL="\"mongodb://admin:$line@$MONGOURL"
            add_to_env $MONGODB_URL $MONGOURL
            CURRENTVAR=""
            ;;
        $EMQ_ENDPOINT)
            line=${line%??}
            rest=${line#*-}
            line=${line#*\"}
            emq="\"https://$line\""           
            add_to_env $EMQ_ENDPOINT $emq
            mqtt="\"wss://mqtt-$rest/mqtt\""
            add_to_env $MQTT_ENDPOINT $mqtt
            CURRENTVAR=""
            ;;
        $EMQ_PW)
            line=${line%?}
            add_to_env $EMQ_PW $line
            CURRENTVAR=""
            ;;
        $KEYCLOAK_SSO_LOGIN_URL)
            line=${line%??}
            line=${line#*\"}
            emq="\"https://$line/realms/scanbot/protocol/saml\""
            add_to_env $KEYCLOAK_SSO_LOGIN_URL $emq
            CURRENTVAR=""
            ;;
        $KEYCLOAK_PW)
            line=${line%?}
            add_to_env $KEYCLOAK_PW $line
            CURRENTVAR=""
            ;;
        $APP_SECRET)
            line=${line%?}
            add_to_env $APP_SECRET $line
            CURRENTVAR=""
            ;;
        $JWT_SECRET)
            line=${line%?}
            add_to_env $JWT_SECRET $line
            CURRENTVAR=""
            ;;
        $AWS_ACCESS_KEY)
            line=${line%?}
            add_to_env $AWS_ACCESS_KEY $line
            CURRENTVAR=""
            ;;
        $AWS_SECRET_KEY)
            line=${line%?}
            add_to_env $AWS_SECRET_KEY $line
            CURRENTVAR=""
            ;;
        $AWS_CONSOLE)
            line=${line%?}
            add_to_env $AWS_CONSOLE $line
            CURRENTVAR=""
            ;;
        $AWS_ENDPOINT)
            line=${line%?}
            add_to_env $AWS_ENDPOINT $line
            CURRENTVAR=""
            ;;
    esac;
    case $line in
        *"$MONGODB_URL_JSON"*)
            CURRENTVAR=$MONGODB_URL
            ;;
        *"$MONGODB_PW_JSON"*)
            CURRENTVAR=$MONGODB_PW
            ;;
        *"$EMQX_URL_JSON"*)
            CURRENTVAR=$EMQ_ENDPOINT
            ;;
        *"$EMQX_PW_JSON"*)
            CURRENTVAR=$EMQ_PW
            ;;
        *"$KC_URL_JSON"*)
            CURRENTVAR=$KEYCLOAK_SSO_LOGIN_URL
            ;;
        *"$KC_PW_JSON"*)
            CURRENTVAR=$KEYCLOAK_PW
            ;;
        *"$APP_SECRET_JSON"*)
            CURRENTVAR=$APP_SECRET
            ;;
        *"$JWT_SECRET_JSON"*)
            CURRENTVAR=$JWT_SECRET
            ;;
        *"$MINIO_KEY_JSON"*)
            CURRENTVAR=$AWS_ACCESS_KEY
            ;;
        *"$MINIO_SECRET_JSON"*)
            CURRENTVAR=$AWS_SECRET_KEY
            ;;
        *"$MINIO_CONSOLE_URL_JSON"*)
            CURRENTVAR=$AWS_CONSOLE
            ;;
        *"$MINIO_STORAGE_URL_JSON"*)
            CURRENTVAR=$AWS_ENDPOINT
            ;;
    esac;
done

write_to_env