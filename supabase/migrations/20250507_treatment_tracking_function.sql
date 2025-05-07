
-- Create a function to insert into treatment_tracking table
CREATE OR REPLACE FUNCTION public.insert_treatment_tracking(
  p_analysis_id UUID,
  p_solution_index INTEGER,
  p_start_date TEXT,
  p_status TEXT,
  p_progress JSONB
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.treatment_tracking(
    analysis_id, 
    solution_index, 
    start_date, 
    status, 
    progress
  ) 
  VALUES (
    p_analysis_id, 
    p_solution_index, 
    p_start_date::TIMESTAMP WITH TIME ZONE, 
    p_status, 
    p_progress
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$;
