Declare
    v_rec_cnt       NUMBER := 0;
    table_records   ${name}_BK${version}JV%ROWTYPE;

    not_exist_table_err EXCEPTION;
    user_define_err     EXCEPTION;

Begin
    Select  Count(*) CT INTO v_rec_cnt
    From    USER_TABLES
    Where   USER_TABLES.TABLE_NAME = '${name}_BK${version}JV';
    If v_rec_cnt <> 1 Then
        Raise not_exist_table_err;
    End If;

    Begin
        Select  * INTO table_records
        From    ${name}_BK${version}JV
        Where   ROWNUM <= 1;
    Exception
        When OTHERS Then
            Raise user_define_err;
    End;

    Execute Immediate 'Truncate Table ${name}';
    Insert Into ${name} Select * From ${name}_BK${version}JV;
End;